# Vitesses du réseau ferroviaire français

## Installer l'application
Pour installer l'application il est nécessaire d'avoir préalablement installé `npm` ou bien `yarn`.
Une fois ceci fait lancez dans un terminal:  
```sh
$ yarn install 
# OU
$ npm install
```

## Lancer l'application
```sh
$ yarn start
# OU
$ npm run start
```


## Mettre à jour les données
Les données sont à placer sous le dossier `public_html/data/` au format geojson. Deux fichiers sont nécessaires:
1. `traces-lignes.geojson`, le fichier contenant le tracés geojson des lignes SNCF (disponible [ici](https://data.sncf.com/explore/dataset/formes-des-lignes-du-rfn/))
2. `vitesses-lignes.geojson`, le fichier content les vitesses des différentes sections de lignes de trains (disponible [ici](https://data.sncf.com/explore/dataset/vitesse-maximale-nominale-sur-ligne/))

Une fois ces fichiers mis à jours et placés dans `public_html/data` il faut ensuite executer la commande:
```
$ yarn build:data
# OU
$ npm run build:data
```

Cette dernière commande générera un fichier `lignes.geojson` qui, lui, sera lu par l'application afin de tracer les lignes sous forme de polygones.
