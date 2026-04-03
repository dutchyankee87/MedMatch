import type { RequestCriterion } from '@/lib/types/criteria';

export const FUNCTION_CRITERIA_TEMPLATES: Record<string, RequestCriterion[]> = {
  'Verpleegkundige IC': [
    { id: 'ic-diploma', category: 'diploma', label: 'IC-diploma', required: true },
    { id: 'big-registratie', category: 'registratie', label: 'BIG-registratie', required: true },
    { id: 'als-diploma', category: 'diploma', label: 'ALS-diploma', required: true },
    { id: 'braun-pompen', category: 'apparatuur', label: 'Ervaring met BRAUN infuuspompen', required: false },
    { id: 'drager-beademing', category: 'apparatuur', label: 'Ervaring met Dräger beademingsapparatuur', required: false },
  ],
  'Anesthesiemedewerker': [
    { id: 'anesthesie-diploma', category: 'diploma', label: 'Diploma anesthesie', required: true },
    { id: 'big-registratie', category: 'registratie', label: 'BIG-registratie', required: true },
    { id: 'als-diploma', category: 'diploma', label: 'ALS-diploma', required: true },
    { id: 'cardiothoracaal', category: 'ervaring', label: 'Ervaring cardiothoracale chirurgie', required: false },
  ],
  'Verpleegkundige SEH': [
    { id: 'seh-aantekening', category: 'diploma', label: 'SEH-aantekening', required: true },
    { id: 'big-registratie', category: 'registratie', label: 'BIG-registratie', required: true },
    { id: 'als-diploma', category: 'diploma', label: 'ALS-diploma', required: true },
    { id: 'triage-ervaring', category: 'ervaring', label: 'Triage-ervaring', required: false },
  ],
  'Verpleegkundige OK': [
    { id: 'ok-diploma', category: 'diploma', label: 'OK-diploma / operatieassistent', required: true },
    { id: 'big-registratie', category: 'registratie', label: 'BIG-registratie', required: true },
    { id: 'instrumenteren', category: 'ervaring', label: 'Ervaring met instrumenteren', required: false },
    { id: 'omloop', category: 'ervaring', label: 'Ervaring als omloop', required: false },
  ],
  'Verpleegkundige': [
    { id: 'big-registratie', category: 'registratie', label: 'BIG-registratie', required: true },
    { id: 'verpleegkunde-diploma', category: 'diploma', label: 'Diploma verpleegkunde (HBO)', required: true },
  ],
  'Verzorgende IG': [
    { id: 'ig-diploma', category: 'diploma', label: 'Diploma Verzorgende IG', required: true },
    { id: 'medicatie-bekwaam', category: 'ervaring', label: 'Medicatie bekwaam (voorbehouden handelingen)', required: false },
  ],
  'Verpleegkundig Specialist': [
    { id: 'big-registratie', category: 'registratie', label: 'BIG-registratie als VS', required: true },
    { id: 'master-anp', category: 'diploma', label: 'Master Advanced Nursing Practice', required: true },
  ],
  'Physician Assistant': [
    { id: 'big-registratie', category: 'registratie', label: 'BIG-registratie als PA', required: true },
    { id: 'master-pa', category: 'diploma', label: 'Master Physician Assistant', required: true },
  ],
};

export const CATEGORY_LABELS: Record<string, string> = {
  diploma: "Diploma's & Certificaten",
  registratie: 'Registraties',
  ervaring: 'Ervaring',
  apparatuur: 'Apparatuur & Middelen',
};
