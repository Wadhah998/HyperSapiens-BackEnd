# Guide de Test du Pipeline Backend

## 📋 Prérequis

1. **Secrets GitHub configurés** dans `Settings → Secrets and variables → Actions` :
   - `DOCKER_USERNAME` : Votre nom d'utilisateur Docker Hub
   - `DOCKER_PASSWORD` : Votre token/mot de passe Docker Hub

2. **Branche** : Vous devez être sur `main`, `master`, ou `develop`

## 🚀 Étapes pour Tester le Pipeline

### Option 1 : Test avec un commit simple (Recommandé)

1. **Ajouter les fichiers modifiés** :
   ```bash
   git add .github/workflows/ci-cd.yml
   git commit -m "test: mise à jour du pipeline CI/CD avec yarn"
   git push origin master
   ```

2. **Vérifier l'exécution** :
   - Allez sur GitHub : `https://github.com/[votre-org]/HyperSapiens-BackEnd`
   - Cliquez sur l'onglet **"Actions"**
   - Vous devriez voir le workflow "Backend CI/CD Pipeline" en cours d'exécution

### Option 2 : Test avec tous les changements

Si vous voulez committer tous les changements :
```bash
git add .
git commit -m "feat: configuration complète du pipeline CI/CD et tests unitaires"
git push origin master
```

## ✅ Vérifications à Faire

### 1. Vérifier le Job "Run Tests"
- ✅ Installation des dépendances avec `yarn install --frozen-lockfile`
- ✅ Exécution des tests avec `yarn test`
- ✅ Génération du rapport de couverture avec `yarn test:cov`
- ✅ Tous les tests doivent passer (68 tests)

### 2. Vérifier le Job "Build and Push Docker Image"
- ✅ Build de l'image Docker réussie
- ✅ Push de l'image vers Docker Hub réussie
- ✅ Tags créés correctement (ex: `master-<sha>`, `latest`)

### 3. Vérifier sur Docker Hub
- Allez sur Docker Hub : `https://hub.docker.com/r/[votre-username]/hyper-sapiens-backend`
- Vérifiez que l'image a été créée avec les bons tags

## 🔍 Dépannage

### Si les tests échouent :
1. Cliquez sur le workflow en échec
2. Cliquez sur le job "Run Tests"
3. Consultez les logs pour identifier l'erreur
4. Vérifiez que les dépendances sont correctement installées

### Si le build Docker échoue :
1. Vérifiez que les secrets `DOCKER_USERNAME` et `DOCKER_PASSWORD` sont corrects
2. Vérifiez que le Dockerfile est valide
3. Consultez les logs du job "Build and Push Docker Image"

### Si le pipeline ne se déclenche pas :
1. Vérifiez que vous êtes sur une branche valide (`main`, `master`, ou `develop`)
2. Vérifiez que le fichier `.github/workflows/ci-cd.yml` est présent
3. Vérifiez que vous avez bien poussé les changements (`git push`)

## 📊 Résultat Attendu

Après un push réussi, vous devriez voir :
- ✅ Job "Run Tests" : **Succès** (vert)
- ✅ Job "Build and Push Docker Image" : **Succès** (vert)
- ✅ Image Docker disponible sur Docker Hub avec les tags appropriés

