const pool = require("../../config/db");

// ================= GET ALL EMPLOYERS =================
exports.getEmployers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.full_name AS name,
        u.email,
        u.phone_number AS phone,
        u.location,
        u.is_verified,
        u.created_at AS joined,
        CASE WHEN u.is_verified THEN 'Active' ELSE 'Inactive' END AS status,
        ep.designation AS "contactPerson",
        ep.organization_name AS "organizationName",
        ep.organization_category AS "organizationCategory",
        ep.number_of_beds AS "numberOfBeds",
        ep.organization_city AS "organizationCity",
        ep.organization_address AS "organizationAddress",
        ep.website_url AS "websiteUrl",
        COUNT(j.id) AS "activeJobs"
      FROM users u
      LEFT JOIN employer_profiles ep ON ep.user_id = u.id
      LEFT JOIN jobs j ON j.employer_id = u.id AND j.is_active = TRUE
      WHERE u.role = 'hr'
      GROUP BY u.id, ep.id
      ORDER BY u.created_at DESC
    `);
    // Parse activeJobs as integer
    const rows = result.rows.map(r => ({ ...r, activeJobs: parseInt(r.activeJobs) || 0 }));
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch employers" });
  }
};

// ================= GET SINGLE EMPLOYER =================
exports.getEmployerById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.full_name AS name,
        u.email,
        u.phone_number AS phone,
        u.location,
        u.is_verified,
        u.created_at AS joined,
        CASE WHEN u.is_verified THEN 'Active' ELSE 'Inactive' END AS status,
        ep.designation AS "contactPerson",
        ep.organization_name AS "organizationName",
        ep.organization_category AS "organizationCategory",
        ep.number_of_beds AS "numberOfBeds",
        ep.organization_city AS "organizationCity",
        ep.organization_address AS "organizationAddress",
        ep.website_url AS "websiteUrl",
        COUNT(j.id) AS "activeJobs"
      FROM users u
      LEFT JOIN employer_profiles ep ON ep.user_id = u.id
      LEFT JOIN jobs j ON j.employer_id = u.id AND j.is_active = TRUE
      WHERE u.id = $1 AND u.role = 'hr'
      GROUP BY u.id, ep.id
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Employer not found" });
    }
    const row = result.rows[0];
    res.json({ ...row, activeJobs: parseInt(row.activeJobs) || 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch employer" });
  }
};

// ================= ADD EMPLOYER (Admin creates an HR user) =================
exports.addEmployer = async (req, res) => {
  const { name, contactPerson, email, phone, location, status } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const isVerified = status === 'Active';

    const userResult = await client.query(
      `INSERT INTO users (full_name, email, role, is_verified, phone_number, location, password)
       VALUES ($1, $2, 'hr', $3, $4, $5, $6)
       RETURNING id, full_name AS name, email, role, is_verified, created_at AS joined`,
      [name, email, isVerified, phone, location, 'admin_created']
    );
    const newUser = userResult.rows[0];

    await client.query(
      `INSERT INTO employer_profiles (user_id, designation) VALUES ($1, $2)`,
      [newUser.id, contactPerson || '']
    );

    await client.query('COMMIT');
    res.status(201).json({ ...newUser, status: isVerified ? 'Active' : 'Inactive', activeJobs: 0 });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: "Failed to add employer" });
  } finally {
    client.release();
  }
};

// ================= UPDATE EMPLOYER =================
exports.updateEmployer = async (req, res) => {
  const { id } = req.params;
  const { name, contactPerson, email, phone, location, status, organization_name, organization_city } = req.body;

  try {
    const isVerified = status === 'Active';

    // Update core user fields
    await pool.query(
      `UPDATE users
       SET full_name   = COALESCE($1, full_name),
           email       = COALESCE($2, email),
           phone_number= COALESCE($3, phone_number),
           location    = COALESCE($4, location),
           is_verified = $5,
           updated_at  = NOW()
       WHERE id = $6 AND role = 'hr'`,
      [name || null, email || null, phone || null, location || null, isVerified, id]
    );

    // Update employer profile fields
    const orgName = organization_name || name || null;
    const orgCity = organization_city || location || null;
    await pool.query(
      `UPDATE employer_profiles
       SET designation       = COALESCE($1, designation),
           organization_name = COALESCE($2, organization_name),
           organization_city = COALESCE($3, organization_city),
           updated_at        = NOW()
       WHERE user_id = $4`,
      [contactPerson || null, orgName, orgCity, id]
    );

    const updated = await pool.query(`
      SELECT u.id, u.full_name AS name, u.email,
             u.phone_number AS phone, u.location, u.is_verified,
             CASE WHEN u.is_verified THEN 'Active' ELSE 'Inactive' END AS status,
             ep.designation AS "contactPerson",
             ep.organization_name AS "organizationName",
             ep.organization_city AS "organizationCity"
      FROM users u
      LEFT JOIN employer_profiles ep ON ep.user_id = u.id
      WHERE u.id = $1
    `, [id]);

    res.json(updated.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update employer" });
  }
};

// ================= DELETE EMPLOYER =================
exports.deleteEmployer = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM users WHERE id=$1 AND role='hr'", [id]);
    res.json({ message: "Employer deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete employer" });
  }
};



// (duplicate stubs removed — correct implementations above)