const express = require("express");
const app = express();

const port = 4050;
const db = require("./database");

app.use(express.json());

app.get("/users", (req, res) => {
  db.query("SELECT * FROM userdata", (err, data) => {
    res.status(200).json({
      status: 200,
      data: data,
    });
  });
});

app.post("/register", (req, res) => {
  const { username, email, password, phone } = req.body;

  if (!username || !email || !password || !phone) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid email format",
    });
  }
  if (password.length < 6 || !/^\d+$/.test(password)) {
    return res.status(400).json({
      message:
        "Invalid password. It must be at least 6 characters long and contain only numeric characters.",
    });
  }

  if (phone.length <= 10 || !/^\d+$/.test(phone)) {
    return res.status(400).json({
      message: "Invalid phone number is only numeric characters.",
    });
  }
  db.query(
    "SELECT * FROM userdata WHERE email = ? OR phone = ?",
    [email, phone],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Internal server error",
        });
      }

      if (results.length > 0) {
        return res.status(400).json({
          message: "Email or phone number is already registered",
        });
      }
      const data = { username, email, password, phone };
      db.query("INSERT INTO userdata SET ?", data, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            message: "Internal server error",
          });
        }

        res.status(200).json({
          message: "Registration successful",
          userId: result.insertId,
        });
      });
    }
  );
});

app.post("/login", (req, res) => {
  const { username, password, phone } = req.body;
  console.log("values", username, password, phone);

  if (!username || (!password && !phone)) {
    return res
      .status(400)
      .json({ message: "username and password or phone is require" });
  }
  let sql = `SELECT * from userdata where username= ?`;
  const params = [username];

  if (password !== undefined && password !== null) {
    sql += "AND password = ?";
    params.push(password);
  }

  if (phone !== undefined && phone !== null) {
    sql += "AND phone = ?";
    params.push(phone);
  }

  db.query(sql, params, (error, result) => {
    if (error) {
      res.status(500).json({ message: "internal server Error" });
    }
    if (result.length > 0) {
      res.status(200).json({
        message: "Login successfully",
        name: username,
        password: password,
        phone: phone,
      });
    } else {
      res.status(401).json({ message: "invalid credentials" });
    }
  });
});

app.listen(port, () => {
  console.log("server running on ");
});
