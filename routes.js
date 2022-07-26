const fs = require("fs");

function requestHandler(req, res) {
  const url = req.url;
  const method = req.method;

  switch (url) {
    case "/":
      switch (method) {
        case "GET":
          res.setHeader("Content-Type", "text/html");
          res.write(`
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Enter Message</title>
</head>
<body>
	<h1>${url}</h1>
	<form action='/message' method='POST'>
		<input type='text' name='message' />
		<button type='submit'>Send</button>
	</form>
</body>
</html>
			`);
          return res.end();
        default:
          break;
      }
      break;
    case "/message":
      switch (method) {
        case "POST":
          const body = [];
          req.on("data", (chunk) => {
            body.push(chunk);
          });
          req.on("end", async () => {
            try {
              const parsedBody = Buffer.concat(body).toString();
              console.log(parsedBody);
              const message = parsedBody.split("=")[1];
              fs.writeFileSync("message.txt", message);
              res.setHeader("Content-Type", "text/html");
              res.write(`
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Message</title>
</head>
<body>
	<h1>${url}</h1>
  <p>${message}</p>
</body>
</html>`);
            } catch (error) {
              res.statusCode = 302;
              res.setHeader("Location", "/");
            } finally {
              res.end();
            }
          });
        default:
          break;
      }
      break;
    default:
      break;
  }
}

module.exports = requestHandler;
