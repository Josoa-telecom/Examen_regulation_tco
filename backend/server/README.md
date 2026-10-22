# API ARTEC (Express + MongoDB)
Prérequis : Node 18+, MongoDB Community (service démarré) ou une base MongoDB Atlas.
Windows (cmd) :
    copy .env.example .env      (puis modifier JWT_SECRET et IP_SALT)
    npm install
    npm run seed
    npm run dev
Test : http://localhost:5000/api/health  ->  {"ok":true}
