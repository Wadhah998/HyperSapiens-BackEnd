const bcrypt = require('bcrypt');

const password = 'adminpassword123';

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Erreur lors du hashage:', err);
    return;
  }
  
  console.log('\n✅ Hash bcrypt généré:');
  console.log(hash);
  console.log('\n📋 Commande Cypher à exécuter dans Neo4j:');
  console.log(`
// 1. Mettre à jour le Counter pour obtenir le prochain ID
MERGE (c:Counter {name: 'User'})
ON CREATE SET c.value = 1
ON MATCH SET c.value = c.value + 1
WITH c.value AS userId

// 2. Créer l'utilisateur admin
CREATE (u:User {
  id: userId,
  name: 'Admin',
  prenom: 'Doe',
  email: 'admin@example.tn',
  password: '${hash}',
  role: 'ADMIN',
  number: 1234567890,
  createdAt: datetime()
})
RETURN u
  `);
});

