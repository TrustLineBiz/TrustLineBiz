const pool = require('../config/db');

async function listLeads(req, res, next) {
  try {
    const { stage, search } = req.query;
    const conditions = [];
    const values = [];

    if (stage) {
      values.push(stage);
      conditions.push(`stage = $${values.length}`);
    }

    if (search) {
      values.push(`%${search}%`);
      conditions.push(`(name ILIKE $${values.length} OR business_name ILIKE $${values.length} OR email ILIKE $${values.length})`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const { rows } = await pool.query(
      `SELECT * FROM leads ${where} ORDER BY created_at DESC LIMIT 500`,
      values
    );

    res.json({ leads: rows, total: rows.length });
  } catch (err) {
    next(err);
  }
}

async function getLead(req, res, next) {
  try {
    const { id } = req.params;

    const [leadRes, notesRes, tasksRes, docsRes, eventsRes] = await Promise.all([
      pool.query('SELECT * FROM leads WHERE id = $1', [id]),
      pool.query('SELECT n.*, u.name AS user_name FROM notes n LEFT JOIN users u ON u.id = n.user_id WHERE n.lead_id = $1 ORDER BY n.created_at DESC', [id]),
      pool.query('SELECT t.*, u.name AS user_name FROM tasks t LEFT JOIN users u ON u.id = t.user_id WHERE t.lead_id = $1 ORDER BY t.due_at ASC NULLS LAST', [id]),
      pool.query('SELECT * FROM lead_documents WHERE lead_id = $1', [id]),
      pool.query('SELECT * FROM lead_events WHERE lead_id = $1 ORDER BY created_at DESC LIMIT 50', [id]),
    ]);

    if (!leadRes.rows[0]) return res.status(404).json({ error: 'Lead not found' });

    res.json({
      ...leadRes.rows[0],
      notes: notesRes.rows,
      tasks: tasksRes.rows,
      documents: docsRes.rows,
      events: eventsRes.rows,
    });
  } catch (err) {
    next(err);
  }
}

async function updateLead(req, res, next) {
  try {
    const { id } = req.params;
    const allowed = [
      'name','business_name','phone','email','credit_score_range','credit_score_exact',
      'monthly_revenue','funding_amount_needed','preferred_call_time','contact_preference',
      'assigned_to','last_contact_date','follow_up_day',
    ];

    const updates = [];
    const values = [];
    for (const key of allowed) {
      if (key in req.body) {
        values.push(req.body[key]);
        updates.push(`${key} = $${values.length}`);
      }
    }

    if (!updates.length) return res.status(400).json({ error: 'No valid fields to update' });

    values.push(id);
    const { rows } = await pool.query(
      `UPDATE leads SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`,
      values
    );

    if (!rows[0]) return res.status(404).json({ error: 'Lead not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function updateStage(req, res, next) {
  try {
    const { id } = req.params;
    const { stage } = req.body;
    const validStages = ['new','contacted','qualified','application_sent','funded','closed_lost'];

    if (!validStages.includes(stage)) {
      return res.status(400).json({ error: `Invalid stage. Must be one of: ${validStages.join(', ')}` });
    }

    const { rows } = await pool.query(
      'UPDATE leads SET stage = $1 WHERE id = $2 RETURNING id, stage, updated_at',
      [stage, id]
    );

    if (!rows[0]) return res.status(404).json({ error: 'Lead not found' });

    await pool.query(
      `INSERT INTO lead_events (lead_id, user_id, event_type, metadata) VALUES ($1,$2,'stage_changed',$3)`,
      [id, req.user.id, JSON.stringify({ stage })]
    );

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function deleteLead(req, res, next) {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM leads WHERE id = $1', [id]);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

async function getNotes(req, res, next) {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      'SELECT n.*, u.name AS user_name FROM notes n LEFT JOIN users u ON u.id = n.user_id WHERE n.lead_id = $1 ORDER BY n.created_at DESC',
      [id]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function addNote(req, res, next) {
  try {
    const { id } = req.params;
    const { content } = req.body;
    if (!content?.trim()) return res.status(400).json({ error: 'Content required' });

    const { rows } = await pool.query(
      'INSERT INTO notes (lead_id, user_id, content) VALUES ($1,$2,$3) RETURNING *',
      [id, req.user.id, content.trim()]
    );

    await pool.query(
      `INSERT INTO lead_events (lead_id, user_id, event_type) VALUES ($1,$2,'note_added')`,
      [id, req.user.id]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function deleteNote(req, res, next) {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM notes WHERE id = $1', [id]);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

async function getTasks(req, res, next) {
  try {
    const { lead_id, completed, due_today } = req.query;
    const conditions = [];
    const values = [];

    if (lead_id) {
      values.push(lead_id);
      conditions.push(`t.lead_id = $${values.length}`);
    }

    if (completed === 'false') {
      conditions.push('t.completed_at IS NULL');
    } else if (completed === 'true') {
      conditions.push('t.completed_at IS NOT NULL');
    }

    if (due_today === 'true') {
      conditions.push("t.due_at::date = CURRENT_DATE");
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const { rows } = await pool.query(
      `SELECT t.*, l.name AS lead_name, u.name AS user_name
       FROM tasks t
       LEFT JOIN leads l ON l.id = t.lead_id
       LEFT JOIN users u ON u.id = t.user_id
       ${where}
       ORDER BY t.due_at ASC NULLS LAST`,
      values
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function createTask(req, res, next) {
  try {
    const { lead_id, title, due_at } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: 'Title required' });

    const { rows } = await pool.query(
      'INSERT INTO tasks (lead_id, user_id, title, due_at) VALUES ($1,$2,$3,$4) RETURNING *',
      [lead_id || null, req.user.id, title.trim(), due_at || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function updateTask(req, res, next) {
  try {
    const { id } = req.params;
    const allowed = ['title', 'due_at', 'completed_at'];
    const updates = [];
    const values = [];

    for (const key of allowed) {
      if (key in req.body) {
        values.push(req.body[key]);
        updates.push(`${key} = $${values.length}`);
      }
    }

    if (!updates.length) return res.status(400).json({ error: 'No valid fields' });

    values.push(id);
    const { rows } = await pool.query(
      `UPDATE tasks SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`,
      values
    );

    if (!rows[0]) return res.status(404).json({ error: 'Task not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function deleteTask(req, res, next) {
  try {
    await pool.query('DELETE FROM tasks WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

async function getAnalyticsSummary(req, res, next) {
  try {
    const [summary, byStage, utmRows, tzCheck] = await Promise.all([
      pool.query(`
        SELECT
          COUNT(*) FILTER (WHERE created_at >= date_trunc('day', NOW() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC') AS leads_today,
          COUNT(*) FILTER (WHERE created_at >= date_trunc('week', NOW() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC') AS leads_week,
          COUNT(*) FILTER (WHERE created_at >= date_trunc('month', NOW() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC') AS leads_month,
          COUNT(*) FILTER (WHERE qualification_status = 'qualified') AS qualified_count,
          COUNT(*) FILTER (WHERE qualification_status = 'disqualified') AS disqualified_count,
          COUNT(*) AS total,
          MIN(created_at) AS oldest_lead,
          MAX(created_at) AS newest_lead,
          NOW() AS server_now,
          CURRENT_DATE AS server_date
        FROM leads
      `),
      pool.query(`
        SELECT stage, COUNT(*) AS count FROM leads GROUP BY stage
      `),
      pool.query(`
        SELECT utm_source, COUNT(*) AS count,
          COUNT(*) FILTER (WHERE qualification_status = 'qualified') AS qualified_count
        FROM leads
        WHERE utm_source IS NOT NULL
        GROUP BY utm_source
        ORDER BY count DESC
      `),
      pool.query(`SHOW timezone`),
    ]);

    const s = summary.rows[0];

    // Debug: log raw SQL result to diagnose zero-count issue
    console.log('[analytics] raw summary row:', JSON.stringify(s, null, 2));
    console.log('[analytics] db timezone:', tzCheck.rows[0]);
    console.log('[analytics] by_stage:', byStage.rows);

    const funded = byStage.rows.find((r) => r.stage === 'funded');
    const total = parseInt(s.total, 10);
    const fundedCount = funded ? parseInt(funded.count, 10) : 0;

    res.json({
      leads_today: parseInt(s.leads_today, 10) || 0,
      leads_week: parseInt(s.leads_week, 10) || 0,
      leads_month: parseInt(s.leads_month, 10) || 0,
      qualified_count: parseInt(s.qualified_count, 10) || 0,
      disqualified_count: parseInt(s.disqualified_count, 10) || 0,
      total,
      conversion_rate: total > 0 ? ((fundedCount / total) * 100).toFixed(1) : '0.0',
      by_stage: Object.fromEntries(byStage.rows.map((r) => [r.stage, parseInt(r.count, 10)])),
      utm_breakdown: utmRows.rows,
      _debug: {
        server_now: s.server_now,
        server_date: s.server_date,
        oldest_lead: s.oldest_lead,
        newest_lead: s.newest_lead,
        db_timezone: tzCheck.rows[0].TimeZone || tzCheck.rows[0].timezone,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listLeads, getLead, updateLead, updateStage, deleteLead,
  getNotes, addNote, deleteNote,
  getTasks, createTask, updateTask, deleteTask,
  getAnalyticsSummary,
};
