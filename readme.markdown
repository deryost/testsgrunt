Pour installer grunt de manière globale avec node.js
npm install -g grunt-cli

Pour créer automatiquement le fichier package.json
npm init

Pour installer grunt et sauvegarder la dépendance dans package.json
npm install grunt --save-dev

Pour ré-installer les modules npm du dossier node_modules à partir de package.json
npm install

Ajouter le dossier node_modules au fichier .gitignore

Créer un fichier "Gruntfile.js" à la racine du projet.


Plugin, exemple d'installation avec grunt-contrib-concat
npm install grunt-contrib-concat --save-dev

Pour exécuter une tâche grunt
ex.: grunt concat:dist
ex.: grunt concat

Shortcut
- Ctrl + c pour quitter la tâche courante


à faire
- grunt-githooks
- créer / copier un dossier
- grunt-newer
- jsdoc
- grunt-contrib-requirejs
- css lint
- php lint
- jsonlint
- grunt-html-validation
- grunt-bump
- grunt-shell, grunt-exec
- grunt-markdown
- grunt-git
