-- Nettoyage de la messagerie : suppression des liens avec les propriétés
-- Ce script supprime la colonne propriete_id de la table demande

-- Vérifier la structure actuelle de la table demande
\d demande;

-- Supprimer la colonne propriete_id si elle existe
ALTER TABLE demande DROP COLUMN IF EXISTS propriete_id;

-- Vérifier la nouvelle structure
\d demande;

-- Afficher quelques demandes pour vérifier
SELECT id, proprietaire_id, gestionnaire_id, statut, créé_le 
FROM demande 
ORDER BY créé_le DESC 
LIMIT 5; 