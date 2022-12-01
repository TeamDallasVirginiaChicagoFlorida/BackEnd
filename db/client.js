const { Client } = require('pg')

const client = new Client("postgres://graceshopper_backend_user:UPTceGXvKnpF3UsUxWhRYEzHIZdaM7nw@dpg-ce4c7qhgp3jocde7o4s0-a.ohio-postgres.render.com/graceshopper_backend?ssl=true"||'postgres://localhost:5432/GraceShopper');

module.exports = {client}