const User = require('./src/models/User');
const jwt = require('jsonwebtoken');

(async () => {
    try {
        const user = await User.findOne({ where: { email: 'advikkhandelwal1207@gmail.com' } });
        if (!user) {
            console.log('User not found');
            process.exit(1);
        }
        
        console.log("Found user:", user.id);
        const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, 'simulation_secret_key_123', { expiresIn: '30d' });
        
        const response = await fetch('https://shopsmart-40r0.onrender.com/cart', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ productId: 1, quantity: 1 })
        });
        
        console.log('Status:', response.status);
        console.log('Body:', await response.text());
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
