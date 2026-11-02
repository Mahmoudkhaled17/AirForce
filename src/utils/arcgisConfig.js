// Base URL for the FeatureServer
const BASE_URL = 'https://services3.arcgis.com/UDCw00RKDRKPqASe/arcgis/rest/services/airport_WFL1/FeatureServer';
const WEB_SCENE_ITEM_ID = '293c33aab909453b8b712a9fe6bbf33d';

// Layers configuration
const LAYERS = {
  AIRPORTS: 0,
  TOWERS: 1,
  BUFFER_RINGS: 3,
  GOVERNMENT: 2,
  GOVERNORATES: 2,
};

// Layer field mappings
const FIELD_MAPPINGS = {
  TOWERS: {
    approviation: 'approviation',
    height: 'height',
    company: 'company',
    notice: 'notice',
    goverment: 'goverment',
    code: 'code',
  },
  AIRPORTS: {
    name: 'name',
    goverment: 'goverment',
  },
};

export { BASE_URL, LAYERS, FIELD_MAPPINGS, WEB_SCENE_ITEM_ID };
