let express = require("express");
let fs = require("fs");
let app = express();

let port = 5001;

app.use(express.json());

app.get("/userData", (req, res) => {
  fs.readFile("dbase.json", (err, data) => {
    res.send(JSON.parse(data));
  });
});

let register = [];

app.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  const isUsernameTaken = register.some((user) => user.username === username);
  if (isUsernameTaken) {
    return res.status(400).json({ message: "Username is already taken" });
  }
  const isEmailTaken = register.find((user) => user.email === email);
  if (isEmailTaken) {
    return res.status(400).json({ message: "Email is already registered" });
  }

  const data = { username, email, password };
  register.push(data);

  fs.writeFile("dbase.json", JSON.stringify(register), (err) => {
    if (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
    res.status(200).json({ message: "User registered successfully" });
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  fs.readFile("dbase.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
    const register = JSON.parse(data);
    const user = register.find((user) => user.email === email);
    if (user && user.password === password) {
      res.status(200).json({
        message: "user successfully register",
        email,
        password,
      });
    } else {
      res.status(400).json({ message: "invalid email or password" });
    }
  });
});

app.listen(port, () => {
  console.log("server running");
});
