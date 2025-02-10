const Jwt = require('@hapi/jwt');

// Remplacez par votre token réel
const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ1cm46YXVkaWVuY2U6aXV0IiwiaXNzIjoidXJuOmlzc3VlcjppdXQiLCJpYXQiOjE3MzkyMDEzODIsImV4cCI6MTczOTIxNTc4Mn0.3uVz_KPo6vLfJLiedGMBsXHHtsPi3ZJvdQ2cKXVrBaVF6HKtv6vEb3IMsIwZ6ajbRLW4XrVV4Orsm2t11HFtJQ";

try {
    const decoded = Jwt.token.decode(token);
    console.log("Decoded payload:", decoded.decoded.payload);
} catch (err) {
    console.error("Invalid token:", err.message);
}
