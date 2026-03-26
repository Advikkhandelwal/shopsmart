const User = require('./src/models/User');
const jwt = require('jsonwebtoken');

(async () => {
    try {
        const user = await User.findOne({ where: { email: 'advikkhandelwal1207@gmail.com' } });
        if (!user) process.exit(0);
        
        const token = jwt.sign({ id: user.id }, 'simulation_secret_key_123', { expiresIn: '30d' });
        
        const response = await fetch('https://shopsmart-40r0.onrender.com/cart', {
            headers: { 
                'Authorization': `Bearer ${token}` 
            }
        });
        
        console.log('Status GET:', response.status);
        console.log('Body GET:', await response.text());
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
