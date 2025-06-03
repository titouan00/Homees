-- Structure SQL pour la table profil_proprietaire

CREATE TABLE profil_proprietaire (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  utilisateur_id UUID REFERENCES utilisateurs(id) ON DELETE CASCADE,
  type_investisseur VARCHAR(50), -- 'particulier', 'professionnel', 'sci'
  nombre_biens INTEGER DEFAULT 0,
  budget_investissement DECIMAL(10,2), -- Budget pour nouveaux investissements
  zone_recherche TEXT, -- Zones géographiques d'intérêt
  preferences_gestionnaire JSONB, -- Préférences pour choisir un gestionnaire
  objectifs TEXT, -- Objectifs d'investissement
  telephone VARCHAR(20),
  adresse TEXT,
  date_naissance DATE,
  profession VARCHAR(100),
  revenus_annuels DECIMAL(10,2),
  situation_familiale VARCHAR(50), -- 'celibataire', 'marie', 'divorce', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les recherches
CREATE INDEX idx_profil_proprietaire_utilisateur_id ON profil_proprietaire(utilisateur_id);
CREATE INDEX idx_profil_proprietaire_type_investisseur ON profil_proprietaire(type_investisseur);
CREATE INDEX idx_profil_proprietaire_zone_recherche ON profil_proprietaire USING GIN(to_tsvector('french', zone_recherche)); 