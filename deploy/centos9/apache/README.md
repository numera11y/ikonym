# Déploiement statique Ikonym — CentOS 9 / Apache 2.4

Le site est généré statiquement par Astro dans `demo-dist/`. Apache sert directement ce répertoire : aucun service Node.js n’est nécessaire en production.

Le vhost fourni est `ikonym.conf`. Il dessert HTTP sur le port 80 avec redirection permanente vers HTTPS, puis sert les fichiers sur le port 443. Il utilise le domaine du projet (`ikonym.numera11y.fr`) et les chemins Certbot usuels; remplace-les si ton domaine ou l’emplacement du certificat diffère.

## 1. Construire le site

Depuis la racine du dépôt, sur la machine de développement :

```sh
npm ci
npm run build
```

Le résultat se trouve dans `demo-dist/`. Si le domaine public est différent, définis `PUBLIC_SITE_URL` avec l’URL HTTPS avant le build afin que les URL canoniques et le sitemap correspondent au domaine utilisé.

Transfère le **contenu** de `demo-dist/` vers un répertoire temporaire sur le serveur, par exemple `/tmp/ikonym/` (SFTP ou `rsync`).

## 2. Installer Apache et publier les fichiers

Sur le serveur CentOS 9 :

```sh
sudo dnf install -y httpd mod_ssl rsync policycoreutils-python-utils
sudo systemctl enable --now httpd
```

Confirme que le compte Apache possède bien le groupe supplémentaire `webdev`, comme prévu :

```sh
id apache
```

Le groupe `webdev` doit apparaître dans la sortie. Si ce n’est pas le cas, ajoute-le puis redémarre Apache :

```sh
sudo usermod -aG webdev apache
sudo systemctl restart httpd
```

Crée la racine et synchronise les fichiers transférés. Le propriétaire pourra mettre le site à jour; Apache, membre de `webdev`, pourra seulement le lire :

```sh
sudo install -d -o webmonstaxx -g webdev -m 2750 /var/www/ikonym
sudo rsync -a --delete --chown=webmonstaxx:webdev /tmp/ikonym/ /var/www/ikonym/
sudo find /var/www/ikonym -type d -exec chmod 2750 {} +
sudo find /var/www/ikonym -type f -exec chmod 0640 {} +
```

Le bit setgid des répertoires conserve le groupe `webdev` pour les nouveaux fichiers. Apache a besoin des droits de lecture et de traversée sur `/var/www/ikonym`.

## 3. SELinux et certificats

Conserve SELinux en mode enforcing et applique le contexte de lecture web :

```sh
sudo semanage fcontext -a -t httpd_sys_content_t '/var/www/ikonym(/.*)?'
sudo restorecon -Rv /var/www/ikonym
```

Le vhost utilise les chemins de certificats Certbot :

```text
/etc/letsencrypt/live/ikonym.numera11y.fr/fullchain.pem
/etc/letsencrypt/live/ikonym.numera11y.fr/privkey.pem
```

Comme tu gères le domaine et le certificat, remplace ces deux chemins dans `ikonym.conf` si ton outil de certificats les place ailleurs. Le certificat doit couvrir le `ServerName` configuré et être installé avant le test de configuration Apache; sinon `apachectl configtest` échouera sur les chemins de certificat absents.

## 4. Activer le vhost

Copie `ikonym.conf` dans `/etc/httpd/conf.d/`, puis vérifie et recharge Apache :

```sh
sudo install -o root -g root -m 0644 ikonym.conf /etc/httpd/conf.d/ikonym.conf
sudo apachectl configtest
sudo systemctl reload httpd
```

Si firewalld est actif, ouvre les deux services web :

```sh
sudo firewall-cmd --permanent --add-service=http --add-service=https
sudo firewall-cmd --reload
```

Vérifie la redirection HTTP et la réponse HTTPS :

```sh
curl -I http://ikonym.numera11y.fr/
curl -I https://ikonym.numera11y.fr/
```

La première requête doit retourner une redirection vers HTTPS; la seconde doit retourner `200`.
