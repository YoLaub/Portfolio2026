# Publier le serveur MCP dans le registre officiel

Le serveur MCP du site est expose sur `https://yl-solution.fr/api/mcp`
(transport Streamable HTTP). Le manifeste de publication est `server.json`
a la racine du repo, valide contre le schema officiel
`2025-12-11/server.schema.json`.

Publier dans le registre officiel (`registry.modelcontextprotocol.io`) rend le
serveur trouvable par les clients et agents MCP qui interrogent ce registre,
ainsi que par les annuaires qui le repliquent (Smithery, mcp.so, PulseMCP,
Glama...).

## Prerequis

- Le site en production doit repondre sur `https://yl-solution.fr/api/mcp`
  (deployer d'abord la branche contenant le serveur MCP).
- Acces a la zone DNS du domaine `yl-solution.fr` (methode DNS, recommandee).

## Etape 1 : installer le CLI mcp-publisher

Binaires publies sur GitHub :
https://github.com/modelcontextprotocol/registry/releases

Sous Windows, telecharger `mcp-publisher_<version>_windows_amd64.tar.gz`,
extraire `mcp-publisher.exe` et le placer dans un dossier du PATH.

## Etape 2 : prouver la propriete du namespace `fr.yl-solution`

Le nom `fr.yl-solution/portfolio` utilise le namespace du domaine
(DNS inverse). Il faut prouver qu'on possede `yl-solution.fr`,
au choix :

### Methode DNS (recommandee)

```
mcp-publisher login dns --domain yl-solution.fr
```

Le CLI affiche un enregistrement TXT a ajouter dans la zone DNS du domaine.
Une fois l'enregistrement propage, la commande valide et delivre le jeton.

### Methode HTTP

```
mcp-publisher login http --domain yl-solution.fr
```

Le CLI demande de servir un fichier de verification sous
`https://yl-solution.fr/.well-known/...` (il indique le chemin exact et le
contenu). Sur ce projet Next.js, deposer le fichier demande dans `public/`
au chemin indique, deployer, puis relancer la commande.

## Etape 3 : publier

Depuis la racine du repo (la ou se trouve `server.json`) :

```
mcp-publisher publish
```

Le CLI lit `server.json`, verifie le schema et pousse l'entree au registre.

## Verifier la publication

```
curl "https://registry.modelcontextprotocol.io/v0/servers?search=yl-solution"
```

L'entree doit apparaitre avec le statut `active`.

## Mettre a jour plus tard

1. Incrementer `version` dans `server.json` (semver).
2. Relancer `mcp-publisher publish` (le jeton de login est conserve
   localement ; se reconnecter si expire).

## Notes

- La description est limitee a 100 caracteres par le schema.
- Le champ `remotes[0].url` doit rester aligne avec l'URL publique reelle
  du serveur. Si l'endpoint change, republier.
- Les annuaires tiers (Smithery, mcp.so, PulseMCP, Glama) repliquent le
  registre officiel ou acceptent une soumission manuelle de l'URL
  `https://yl-solution.fr/api/mcp` pour plus de visibilite.
