# 💖 5 jours, une évidence

Une expérience web interactive romantique progressive du 10 au 14 février 2026, culminant avec une surprise spéciale pour la Saint-Valentin.

![Version](https://img.shields.io/badge/version-1.1.0-pink)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Fonctionnalités

### 🎯 Expérience principale
- **Progression jour par jour** : Contenu unique déverrouillé chaque jour
- **5 jours d'émotions** : Du 10 au 14 février avec montée émotionnelle progressive
- **Persistance des données** : Sauvegarde automatique des réponses et progression
- **Design romantique** : Gradients animés, glassmorphism, et animations fluides

### 🎮 Contenu interactif
- **Jour 1** : Message d'introduction avec effet typewriter
- **Jour 2** : Question interactive avec 6 choix émotionnels
- **Jour 3** : Quiz "Combien tu me connais ?" avec 5 questions personnalisées
- **Jour 4** : Compte à rebours en temps réel jusqu'à minuit
- **Jour 5** : Message final personnalisé basé sur les réponses précédentes

### 🎁 Fonctionnalités premium
- ✨ **Effet typewriter** : Messages révélés lettre par lettre
- 💥 **Explosion de cœurs** : Animation lors des interactions
- 🎨 **Background animé** : Gradients multicouches avec particules scintillantes
- 🎮 **Quiz interactif** : Mini-jeu au Jour 3 avec score et feedback
- 📸 **Galerie de souvenirs** : Section cachée pour vos photos (`Ctrl+Shift+G`)
- 🎁 **Easter egg secret** : Message caché (5 clics sur le titre)
- 🔧 **Mode développeur** : Accès à tous les jours pour tester (`Ctrl+Shift+D`)
- 🎵 **Musique de fond** : Avec contrôle manuel et démarrage non-intrusif

### ♿ Accessibilité
- **Reduced motion** : Respect de `prefers-reduced-motion` pour les animations
- **Navigation clavier** : États `:focus-visible` sur tous les éléments interactifs
- **Responsive avancé** : Support des très petits écrans (<360px) et mode paysage mobile
- **Scrollbar personnalisé** : Design élégant sur tous les navigateurs

## 🚀 Installation

### Prérequis
- Navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Serveur HTTP local (optionnel mais recommandé)

### Lancement rapide

1. **Cloner ou télécharger le projet**
   ```bash
   git clone <votre-repo-url>
   cd "Romance app"
   ```

2. **Lancer avec un serveur local**
   ```bash
   npx -y http-server -p 8080 -o
   ```

3. **Ou simplement ouvrir `index.html`** dans votre navigateur

## 🎯 Utilisation

### Navigation normale
- L'application déverrouille automatiquement le contenu selon la date actuelle
- Cliquez sur les points de navigation pour revenir aux jours précédents
- Les jours futurs sont verrouillés jusqu'à leur date

### Raccourcis clavier
- `Ctrl+Shift+D` : Activer/désactiver le mode développeur
- `Ctrl+Shift+G` : Ouvrir la galerie de souvenirs
- 5 clics sur le titre : Révéler l'easter egg secret

### Mode développeur
Permet de tester tous les jours immédiatement :
1. Appuyez sur `Ctrl+Shift+D`
2. Tous les jours deviennent accessibles
3. Utilisez "Reset Data" pour effacer les données sauvegardées

## 🎨 Personnalisation

### 1. Modifier les questions du quiz (Jour 3)
Éditez `main.js` lignes 44-80 :
```javascript
questions: [
    {
        question: "Votre question ?",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        correct: 0, // Index de la bonne réponse (0-3)
        emoji: "🎨"
    },
    // ...
]
```

### 2. Ajouter vos photos à la galerie
1. Créez le dossier `assets/photos/`
2. Ajoutez vos photos (photo1.jpg, photo2.jpg, etc.)
3. Modifiez la fonction `showPhotoGallery()` dans `main.js` pour afficher vos images

### 3. Personnaliser les messages
Éditez `main.js` section `DAY_CONTENT` (lignes 22-80) pour modifier les messages de chaque jour

### 4. Changer les couleurs
Modifiez les variables CSS dans `style.css` (lignes 4-35) :
```css
:root {
    --primary-pink: #ff6b9d;
    --primary-red: #c44569;
    /* ... */
}
```

## 📁 Structure du projet

```
Romance app/
├── index.html          # Page principale
├── style.css           # Styles et animations
├── main.js             # Logique de l'application
├── assets/             # Ressources
│   ├── heart_favicon.png
│   └── photos/         # Vos photos (à créer)
└── README.md           # Ce fichier
```

## 🛠️ Technologies utilisées

- **HTML5** : Structure sémantique
- **CSS3** : Animations, gradients, glassmorphism
- **JavaScript (Vanilla)** : Logique interactive
- **LocalStorage** : Persistance des données
- **Google Fonts** : Playfair Display & Inter

## 🎯 Optimisations de performance

- Accélération GPU avec `will-change` et `translateZ(0)`
- Utilisation de `translate3d` pour les animations
- Réduction du nombre d'éléments animés (cœurs : 15→8)
- Antialiasing des polices activé
- Typewriter optimisé (20ms→15ms)
- Nettoyage automatique des intervals (countdown)
- Autoplay audio non-intrusif (pas de mousemove/scroll)

## 🔒 Sécurité

- Protection XSS dans le système de notifications
- Gestion sécurisée du localStorage (try/catch)
- Pas de dépendances externes vulnérables

## 📱 Compatibilité

- ✅ Chrome / Edge (recommandé)
- ✅ Firefox (scrollbar stylisé inclus)
- ✅ Safari
- ✅ Mobile (iOS / Android)
- ✅ Responsive (320px → 1920px)
- ✅ Mode paysage mobile
- ✅ Navigation clavier complète

## 🤝 Contribution

Ce projet est personnel, mais vous pouvez :
1. Fork le projet
2. Créer une branche (`git checkout -b feature/amelioration`)
3. Commit vos changements (`git commit -m 'Ajout fonctionnalité'`)
4. Push vers la branche (`git push origin feature/amelioration`)
5. Ouvrir une Pull Request

## 📝 License

MIT License - Libre d'utilisation et de modification

## 💝 Crédits

Créé avec ❤️ pour une Saint-Valentin inoubliable

---

**Note** : N'oubliez pas de personnaliser les questions du quiz et d'ajouter vos propres photos pour rendre l'expérience unique !
