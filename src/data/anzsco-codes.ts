// Comprehensive ANZSCO (Australian and New Zealand Standard Classification of Occupations) codes
// Source: Australian Bureau of Statistics

export interface ANZSCOOccupation {
  code: string;
  title: string;
  skillLevel: number;
  majorGroup: string;
  minorGroup: string;
  unitGroup: string;
  description?: string;
  alternativeTitles?: string[];
  assessingAuthority?: string;
  mltssl?: boolean;  // Medium and Long-term Strategic Skills List
  stsol?: boolean;   // Short-term Skilled Occupation List
  regional?: boolean; // Regional Occupation List
  pmsol?: boolean;   // Priority Migration Skilled Occupation List
}

// Major Groups
export const majorGroups: Record<string, string> = {
  '1': 'Managers',
  '2': 'Professionals', 
  '3': 'Technicians and Trades Workers',
  '4': 'Community and Personal Service Workers',
  '5': 'Clerical and Administrative Workers',
  '6': 'Sales Workers',
  '7': 'Machinery Operators and Drivers',
  '8': 'Labourers'
};

// Complete ANZSCO occupations list
export const anzscoOccupations: ANZSCOOccupation[] = [
  // MANAGERS (1xxx)
  { code: '111111', title: 'Chief Executive or Managing Director', skillLevel: 1, majorGroup: '1', minorGroup: '111', unitGroup: '1111', assessingAuthority: 'IML', mltssl: true, regional: true },
  { code: '111211', title: 'Corporate General Manager', skillLevel: 1, majorGroup: '1', minorGroup: '111', unitGroup: '1112', assessingAuthority: 'IML', mltssl: true, regional: true },
  { code: '111212', title: 'Defence Force Senior Officer', skillLevel: 1, majorGroup: '1', minorGroup: '111', unitGroup: '1112' },
  { code: '111311', title: 'Local Government Legislator', skillLevel: 1, majorGroup: '1', minorGroup: '111', unitGroup: '1113' },
  { code: '111312', title: 'Member of Parliament', skillLevel: 1, majorGroup: '1', minorGroup: '111', unitGroup: '1113' },
  { code: '111399', title: 'Legislators nec', skillLevel: 1, majorGroup: '1', minorGroup: '111', unitGroup: '1113' },
  
  // Farmers and Farm Managers (121)
  { code: '121111', title: 'Aquaculture Farmer', skillLevel: 1, majorGroup: '1', minorGroup: '121', unitGroup: '1211', assessingAuthority: 'VETASSESS', mltssl: true, regional: true },
  { code: '121211', title: 'Cotton Grower', skillLevel: 1, majorGroup: '1', minorGroup: '121', unitGroup: '1212', assessingAuthority: 'VETASSESS', mltssl: true, regional: true },
  { code: '121212', title: 'Flower Grower', skillLevel: 1, majorGroup: '1', minorGroup: '121', unitGroup: '1212', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '121213', title: 'Fruit or Nut Grower', skillLevel: 1, majorGroup: '1', minorGroup: '121', unitGroup: '1212', assessingAuthority: 'VETASSESS', mltssl: true, regional: true },
  { code: '121214', title: 'Grain, Oilseed or Pasture Grower', skillLevel: 1, majorGroup: '1', minorGroup: '121', unitGroup: '1212', assessingAuthority: 'VETASSESS', mltssl: true, regional: true },
  { code: '121215', title: 'Grape Grower', skillLevel: 1, majorGroup: '1', minorGroup: '121', unitGroup: '1212', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '121216', title: 'Mixed Crop Farmer', skillLevel: 1, majorGroup: '1', minorGroup: '121', unitGroup: '1212', assessingAuthority: 'VETASSESS', mltssl: true, regional: true },
  { code: '121217', title: 'Sugar Cane Grower', skillLevel: 1, majorGroup: '1', minorGroup: '121', unitGroup: '1212', assessingAuthority: 'VETASSESS', mltssl: true, regional: true },
  { code: '121218', title: 'Turf Grower', skillLevel: 1, majorGroup: '1', minorGroup: '121', unitGroup: '1212', assessingAuthority: 'VETASSESS', regional: true },
  { code: '121221', title: 'Vegetable Grower', skillLevel: 1, majorGroup: '1', minorGroup: '121', unitGroup: '1212', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '121299', title: 'Crop Farmers nec', skillLevel: 1, majorGroup: '1', minorGroup: '121', unitGroup: '1212', assessingAuthority: 'VETASSESS', mltssl: true, regional: true },
  
  // Livestock Farmers (1213)
  { code: '121311', title: 'Apiarist', skillLevel: 1, majorGroup: '1', minorGroup: '121', unitGroup: '1213', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '121312', title: 'Beef Cattle Farmer', skillLevel: 1, majorGroup: '1', minorGroup: '121', unitGroup: '1213', assessingAuthority: 'VETASSESS', mltssl: true, regional: true },
  { code: '121313', title: 'Dairy Cattle Farmer', skillLevel: 1, majorGroup: '1', minorGroup: '121', unitGroup: '1213', assessingAuthority: 'VETASSESS', mltssl: true, regional: true },
  { code: '121314', title: 'Deer Farmer', skillLevel: 1, majorGroup: '1', minorGroup: '121', unitGroup: '1213', assessingAuthority: 'VETASSESS', mltssl: true, regional: true },
  { code: '121315', title: 'Goat Farmer', skillLevel: 1, majorGroup: '1', minorGroup: '121', unitGroup: '1213', assessingAuthority: 'VETASSESS', mltssl: true, regional: true },
  { code: '121316', title: 'Horse Breeder', skillLevel: 1, majorGroup: '1', minorGroup: '121', unitGroup: '1213', assessingAuthority: 'VETASSESS', mltssl: true, regional: true },
  { code: '121317', title: 'Mixed Livestock Farmer', skillLevel: 1, majorGroup: '1', minorGroup: '121', unitGroup: '1213', assessingAuthority: 'VETASSESS', mltssl: true, regional: true },
  { code: '121318', title: 'Pig Farmer', skillLevel: 1, majorGroup: '1', minorGroup: '121', unitGroup: '1213', assessingAuthority: 'VETASSESS', mltssl: true, regional: true },
  { code: '121321', title: 'Poultry Farmer', skillLevel: 1, majorGroup: '1', minorGroup: '121', unitGroup: '1213', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '121322', title: 'Sheep Farmer', skillLevel: 1, majorGroup: '1', minorGroup: '121', unitGroup: '1213', assessingAuthority: 'VETASSESS', mltssl: true, regional: true },
  { code: '121399', title: 'Livestock Farmers nec', skillLevel: 1, majorGroup: '1', minorGroup: '121', unitGroup: '1213', assessingAuthority: 'VETASSESS', mltssl: true, regional: true },
  { code: '121411', title: 'Mixed Crop and Livestock Farmer', skillLevel: 1, majorGroup: '1', minorGroup: '121', unitGroup: '1214', assessingAuthority: 'VETASSESS', mltssl: true, regional: true },
  
  // Specialist Managers (13xx)
  { code: '131112', title: 'Sales and Marketing Manager', skillLevel: 1, majorGroup: '1', minorGroup: '131', unitGroup: '1311', assessingAuthority: 'IML', stsol: true, regional: true },
  { code: '131113', title: 'Advertising Manager', skillLevel: 1, majorGroup: '1', minorGroup: '131', unitGroup: '1311', assessingAuthority: 'IML', stsol: true, regional: true },
  { code: '131114', title: 'Public Relations Manager', skillLevel: 1, majorGroup: '1', minorGroup: '131', unitGroup: '1311', assessingAuthority: 'IML', mltssl: true, regional: true },
  { code: '132111', title: 'Corporate Services Manager', skillLevel: 1, majorGroup: '1', minorGroup: '132', unitGroup: '1321', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '132211', title: 'Finance Manager', skillLevel: 1, majorGroup: '1', minorGroup: '132', unitGroup: '1322', assessingAuthority: 'CPAA/CAANZ/IPA', stsol: true, regional: true },
  { code: '132311', title: 'Human Resource Manager', skillLevel: 1, majorGroup: '1', minorGroup: '132', unitGroup: '1323', assessingAuthority: 'IML', stsol: true, regional: true },
  { code: '132411', title: 'Policy and Planning Manager', skillLevel: 1, majorGroup: '1', minorGroup: '132', unitGroup: '1324', assessingAuthority: 'VETASSESS', mltssl: true, regional: true },
  { code: '132511', title: 'Research and Development Manager', skillLevel: 1, majorGroup: '1', minorGroup: '132', unitGroup: '1325', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '133111', title: 'Construction Project Manager', skillLevel: 1, majorGroup: '1', minorGroup: '133', unitGroup: '1331', assessingAuthority: 'VETASSESS', mltssl: true, regional: true },
  { code: '133112', title: 'Project Builder', skillLevel: 1, majorGroup: '1', minorGroup: '133', unitGroup: '1331', assessingAuthority: 'VETASSESS', mltssl: true, regional: true },
  { code: '133211', title: 'Engineering Manager', skillLevel: 1, majorGroup: '1', minorGroup: '133', unitGroup: '1332', assessingAuthority: 'EA/IML', mltssl: true, regional: true },
  { code: '133311', title: 'Importer or Exporter', skillLevel: 1, majorGroup: '1', minorGroup: '133', unitGroup: '1333', assessingAuthority: 'VETASSESS', regional: true },
  { code: '133312', title: 'Wholesaler', skillLevel: 1, majorGroup: '1', minorGroup: '133', unitGroup: '1333', assessingAuthority: 'VETASSESS', regional: true },
  { code: '133411', title: 'Manufacturer', skillLevel: 1, majorGroup: '1', minorGroup: '133', unitGroup: '1334', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '133511', title: 'Production Manager (Forestry)', skillLevel: 1, majorGroup: '1', minorGroup: '133', unitGroup: '1335', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '133512', title: 'Production Manager (Manufacturing)', skillLevel: 1, majorGroup: '1', minorGroup: '133', unitGroup: '1335', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '133513', title: 'Production Manager (Mining)', skillLevel: 1, majorGroup: '1', minorGroup: '133', unitGroup: '1335', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '133611', title: 'Supply and Distribution Manager', skillLevel: 1, majorGroup: '1', minorGroup: '133', unitGroup: '1336', assessingAuthority: 'IML', stsol: true, regional: true },
  { code: '133612', title: 'Procurement Manager', skillLevel: 1, majorGroup: '1', minorGroup: '133', unitGroup: '1336', assessingAuthority: 'IML', mltssl: true, regional: true },
  
  // Health and Welfare Managers (134)
  { code: '134111', title: 'Child Care Centre Manager', skillLevel: 1, majorGroup: '1', minorGroup: '134', unitGroup: '1341', assessingAuthority: 'ACECQA', mltssl: true, regional: true, pmsol: true },
  { code: '134211', title: 'Medical Administrator', skillLevel: 1, majorGroup: '1', minorGroup: '134', unitGroup: '1342', assessingAuthority: 'VETASSESS', mltssl: true, regional: true },
  { code: '134212', title: 'Nursing Clinical Director', skillLevel: 1, majorGroup: '1', minorGroup: '134', unitGroup: '1342', assessingAuthority: 'ANMAC', mltssl: true, regional: true },
  { code: '134213', title: 'Primary Health Organisation Manager', skillLevel: 1, majorGroup: '1', minorGroup: '134', unitGroup: '1342', assessingAuthority: 'VETASSESS', mltssl: true, regional: true },
  { code: '134214', title: 'Welfare Centre Manager', skillLevel: 1, majorGroup: '1', minorGroup: '134', unitGroup: '1342', assessingAuthority: 'ACWA', mltssl: true, regional: true },
  { code: '134299', title: 'Health and Welfare Services Managers nec', skillLevel: 1, majorGroup: '1', minorGroup: '134', unitGroup: '1342', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  
  // Education Managers (1343)
  { code: '134311', title: 'School Principal', skillLevel: 1, majorGroup: '1', minorGroup: '134', unitGroup: '1343', assessingAuthority: 'VETASSESS', stsol: true, regional: true, pmsol: true },
  { code: '134411', title: 'Faculty Head', skillLevel: 1, majorGroup: '1', minorGroup: '134', unitGroup: '1344', assessingAuthority: 'VETASSESS', mltssl: true },
  { code: '134412', title: 'Regional Education Manager', skillLevel: 1, majorGroup: '1', minorGroup: '134', unitGroup: '1344', assessingAuthority: 'VETASSESS', mltssl: true, regional: true },
  { code: '134499', title: 'Education Managers nec', skillLevel: 1, majorGroup: '1', minorGroup: '134', unitGroup: '1344', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  
  // ICT Managers (1351)
  { code: '135111', title: 'Chief Information Officer', skillLevel: 1, majorGroup: '1', minorGroup: '135', unitGroup: '1351', assessingAuthority: 'ACS', mltssl: true },
  { code: '135112', title: 'ICT Project Manager', skillLevel: 1, majorGroup: '1', minorGroup: '135', unitGroup: '1351', assessingAuthority: 'ACS', stsol: true, regional: true },
  { code: '135199', title: 'ICT Managers nec', skillLevel: 1, majorGroup: '1', minorGroup: '135', unitGroup: '1351', assessingAuthority: 'ACS', stsol: true, regional: true },

  // PROFESSIONALS (2xxx)
  // Arts and Media Professionals (211)
  { code: '211111', title: 'Actor', skillLevel: 1, majorGroup: '2', minorGroup: '211', unitGroup: '2111', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '211112', title: 'Dancer or Choreographer', skillLevel: 1, majorGroup: '2', minorGroup: '211', unitGroup: '2111', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '211113', title: 'Entertainer or Variety Artist', skillLevel: 1, majorGroup: '2', minorGroup: '211', unitGroup: '2111', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '211199', title: 'Actors, Dancers and Other Entertainers nec', skillLevel: 1, majorGroup: '2', minorGroup: '211', unitGroup: '2111', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '211211', title: 'Composer', skillLevel: 1, majorGroup: '2', minorGroup: '211', unitGroup: '2112', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '211212', title: 'Music Director', skillLevel: 1, majorGroup: '2', minorGroup: '211', unitGroup: '2112', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '211213', title: 'Musician (Instrumental)', skillLevel: 1, majorGroup: '2', minorGroup: '211', unitGroup: '2112', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '211214', title: 'Singer', skillLevel: 1, majorGroup: '2', minorGroup: '211', unitGroup: '2112', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '211299', title: 'Music Professionals nec', skillLevel: 1, majorGroup: '2', minorGroup: '211', unitGroup: '2112', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '211311', title: 'Photographer', skillLevel: 1, majorGroup: '2', minorGroup: '211', unitGroup: '2113', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '211411', title: 'Painter (Visual Arts)', skillLevel: 1, majorGroup: '2', minorGroup: '211', unitGroup: '2114', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '211412', title: 'Potter or Ceramic Artist', skillLevel: 1, majorGroup: '2', minorGroup: '211', unitGroup: '2114', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '211413', title: 'Sculptor', skillLevel: 1, majorGroup: '2', minorGroup: '211', unitGroup: '2114', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '211499', title: 'Visual Arts and Crafts Professionals nec', skillLevel: 1, majorGroup: '2', minorGroup: '211', unitGroup: '2114', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  
  // Media Professionals (212)
  { code: '212111', title: 'Artistic Director', skillLevel: 1, majorGroup: '2', minorGroup: '212', unitGroup: '2121', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '212112', title: 'Media Producer (excluding Video)', skillLevel: 1, majorGroup: '2', minorGroup: '212', unitGroup: '2121', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '212113', title: 'Radio Presenter', skillLevel: 1, majorGroup: '2', minorGroup: '212', unitGroup: '2121', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '212114', title: 'Television Presenter', skillLevel: 1, majorGroup: '2', minorGroup: '212', unitGroup: '2121', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '212211', title: 'Author', skillLevel: 1, majorGroup: '2', minorGroup: '212', unitGroup: '2122', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '212212', title: 'Book or Script Editor', skillLevel: 1, majorGroup: '2', minorGroup: '212', unitGroup: '2122', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '212311', title: 'Art Director (Film, Television or Stage)', skillLevel: 1, majorGroup: '2', minorGroup: '212', unitGroup: '2123', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '212312', title: 'Director (Film, Television, Radio or Stage)', skillLevel: 1, majorGroup: '2', minorGroup: '212', unitGroup: '2123', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '212313', title: 'Director of Photography', skillLevel: 1, majorGroup: '2', minorGroup: '212', unitGroup: '2123', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '212314', title: 'Film and Video Editor', skillLevel: 1, majorGroup: '2', minorGroup: '212', unitGroup: '2123', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '212315', title: 'Program Director (Television or Radio)', skillLevel: 1, majorGroup: '2', minorGroup: '212', unitGroup: '2123', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '212316', title: 'Stage Manager', skillLevel: 1, majorGroup: '2', minorGroup: '212', unitGroup: '2123', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '212317', title: 'Technical Director', skillLevel: 1, majorGroup: '2', minorGroup: '212', unitGroup: '2123', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '212318', title: 'Video Producer', skillLevel: 1, majorGroup: '2', minorGroup: '212', unitGroup: '2123', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '212399', title: 'Film, Television, Radio and Stage Directors nec', skillLevel: 1, majorGroup: '2', minorGroup: '212', unitGroup: '2123', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '212411', title: 'Copywriter', skillLevel: 1, majorGroup: '2', minorGroup: '212', unitGroup: '2124', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '212412', title: 'Newspaper or Periodical Editor', skillLevel: 1, majorGroup: '2', minorGroup: '212', unitGroup: '2124', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '212413', title: 'Print Journalist', skillLevel: 1, majorGroup: '2', minorGroup: '212', unitGroup: '2124', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '212414', title: 'Radio Journalist', skillLevel: 1, majorGroup: '2', minorGroup: '212', unitGroup: '2124', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '212415', title: 'Technical Writer', skillLevel: 1, majorGroup: '2', minorGroup: '212', unitGroup: '2124', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '212416', title: 'Television Journalist', skillLevel: 1, majorGroup: '2', minorGroup: '212', unitGroup: '2124', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '212499', title: 'Journalists and Other Writers nec', skillLevel: 1, majorGroup: '2', minorGroup: '212', unitGroup: '2124', assessingAuthority: 'VETASSESS', stsol: true, regional: true },

  // Business, Human Resource and Marketing Professionals (22xx)
  { code: '221111', title: 'Accountant (General)', skillLevel: 1, majorGroup: '2', minorGroup: '221', unitGroup: '2211', assessingAuthority: 'CPAA/CAANZ/IPA', mltssl: true, regional: true },
  { code: '221112', title: 'Management Accountant', skillLevel: 1, majorGroup: '2', minorGroup: '221', unitGroup: '2211', assessingAuthority: 'CPAA/CAANZ/IPA', mltssl: true, regional: true },
  { code: '221113', title: 'Taxation Accountant', skillLevel: 1, majorGroup: '2', minorGroup: '221', unitGroup: '2211', assessingAuthority: 'CPAA/CAANZ/IPA', mltssl: true, regional: true },
  { code: '221211', title: 'Company Secretary', skillLevel: 1, majorGroup: '2', minorGroup: '221', unitGroup: '2212', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '221212', title: 'Corporate Treasurer', skillLevel: 1, majorGroup: '2', minorGroup: '221', unitGroup: '2212', assessingAuthority: 'VETASSESS', mltssl: true, regional: true },
  { code: '221213', title: 'External Auditor', skillLevel: 1, majorGroup: '2', minorGroup: '221', unitGroup: '2212', assessingAuthority: 'CAANZ/CPAA/IPA', mltssl: true, regional: true },
  { code: '221214', title: 'Internal Auditor', skillLevel: 1, majorGroup: '2', minorGroup: '221', unitGroup: '2212', assessingAuthority: 'VETASSESS', mltssl: true, regional: true },
  
  // ICT Professionals (26xx)
  { code: '261111', title: 'ICT Business Analyst', skillLevel: 1, majorGroup: '2', minorGroup: '261', unitGroup: '2611', assessingAuthority: 'ACS', mltssl: true, regional: true },
  { code: '261112', title: 'Systems Analyst', skillLevel: 1, majorGroup: '2', minorGroup: '261', unitGroup: '2611', assessingAuthority: 'ACS', mltssl: true, regional: true },
  { code: '261211', title: 'Multimedia Specialist', skillLevel: 1, majorGroup: '2', minorGroup: '261', unitGroup: '2612', assessingAuthority: 'ACS', mltssl: true, regional: true },
  { code: '261212', title: 'Web Developer', skillLevel: 1, majorGroup: '2', minorGroup: '261', unitGroup: '2612', assessingAuthority: 'ACS', mltssl: true, regional: true },
  { code: '261311', title: 'Analyst Programmer', skillLevel: 1, majorGroup: '2', minorGroup: '261', unitGroup: '2613', assessingAuthority: 'ACS', mltssl: true, regional: true },
  { code: '261312', title: 'Developer Programmer', skillLevel: 1, majorGroup: '2', minorGroup: '261', unitGroup: '2613', assessingAuthority: 'ACS', mltssl: true, regional: true },
  { code: '261313', title: 'Software Engineer', skillLevel: 1, majorGroup: '2', minorGroup: '261', unitGroup: '2613', assessingAuthority: 'ACS', mltssl: true, regional: true, pmsol: true },
  { code: '261314', title: 'Software Tester', skillLevel: 1, majorGroup: '2', minorGroup: '261', unitGroup: '2613', assessingAuthority: 'ACS', mltssl: true, regional: true },
  { code: '261399', title: 'Software and Applications Programmers nec', skillLevel: 1, majorGroup: '2', minorGroup: '261', unitGroup: '2613', assessingAuthority: 'ACS', mltssl: true, regional: true },
  { code: '261411', title: 'Database Administrator', skillLevel: 1, majorGroup: '2', minorGroup: '261', unitGroup: '2614', assessingAuthority: 'ACS', mltssl: true, regional: true },
  { code: '261412', title: 'ICT Security Specialist', skillLevel: 1, majorGroup: '2', minorGroup: '261', unitGroup: '2614', assessingAuthority: 'ACS', mltssl: true, regional: true, pmsol: true },
  { code: '261413', title: 'Systems Administrator', skillLevel: 1, majorGroup: '2', minorGroup: '261', unitGroup: '2614', assessingAuthority: 'ACS', mltssl: true, regional: true },
  { code: '261511', title: 'ICT Systems Test Engineer', skillLevel: 1, majorGroup: '2', minorGroup: '261', unitGroup: '2615', assessingAuthority: 'ACS', stsol: true, regional: true },
  { code: '261512', title: 'ICT Support and Test Engineer nec', skillLevel: 1, majorGroup: '2', minorGroup: '261', unitGroup: '2615', assessingAuthority: 'ACS', stsol: true, regional: true },
  { code: '261611', title: 'ICT Business Development Manager', skillLevel: 1, majorGroup: '2', minorGroup: '261', unitGroup: '2616', assessingAuthority: 'ACS', stsol: true, regional: true },
  { code: '261612', title: 'ICT Customer Support Officer', skillLevel: 2, majorGroup: '2', minorGroup: '261', unitGroup: '2616', assessingAuthority: 'ACS', stsol: true, regional: true },
  { code: '261613', title: 'ICT Support Technicians nec', skillLevel: 2, majorGroup: '2', minorGroup: '261', unitGroup: '2616', assessingAuthority: 'ACS', stsol: true, regional: true },
  
  // Telecommunications Professionals (263)
  { code: '263111', title: 'Computer Network and Systems Engineer', skillLevel: 1, majorGroup: '2', minorGroup: '263', unitGroup: '2631', assessingAuthority: 'ACS', mltssl: true, regional: true },
  { code: '263112', title: 'Network Administrator', skillLevel: 1, majorGroup: '2', minorGroup: '263', unitGroup: '2631', assessingAuthority: 'ACS', mltssl: true, regional: true },
  { code: '263113', title: 'Network Analyst', skillLevel: 1, majorGroup: '2', minorGroup: '263', unitGroup: '2631', assessingAuthority: 'ACS', mltssl: true, regional: true },
  { code: '263211', title: 'ICT Quality Assurance Engineer', skillLevel: 1, majorGroup: '2', minorGroup: '263', unitGroup: '2632', assessingAuthority: 'ACS', stsol: true, regional: true },
  { code: '263212', title: 'ICT Support Engineer', skillLevel: 1, majorGroup: '2', minorGroup: '263', unitGroup: '2632', assessingAuthority: 'ACS', stsol: true, regional: true },
  { code: '263213', title: 'ICT Systems Test Engineer', skillLevel: 1, majorGroup: '2', minorGroup: '263', unitGroup: '2632', assessingAuthority: 'ACS', stsol: true, regional: true },
  { code: '263299', title: 'ICT Support and Test Engineers nec', skillLevel: 1, majorGroup: '2', minorGroup: '263', unitGroup: '2632', assessingAuthority: 'ACS', stsol: true, regional: true },
  { code: '263311', title: 'Telecommunications Engineer', skillLevel: 1, majorGroup: '2', minorGroup: '263', unitGroup: '2633', assessingAuthority: 'EA', mltssl: true, regional: true },
  { code: '263312', title: 'Telecommunications Network Engineer', skillLevel: 1, majorGroup: '2', minorGroup: '263', unitGroup: '2633', assessingAuthority: 'EA', mltssl: true, regional: true },
  { code: '263411', title: 'Electronics Engineer', skillLevel: 1, majorGroup: '2', minorGroup: '263', unitGroup: '2634', assessingAuthority: 'EA', mltssl: true, regional: true },

  // Engineers (23xx)
  { code: '233111', title: 'Chemical Engineer', skillLevel: 1, majorGroup: '2', minorGroup: '233', unitGroup: '2331', assessingAuthority: 'EA', mltssl: true, regional: true },
  { code: '233112', title: 'Materials Engineer', skillLevel: 1, majorGroup: '2', minorGroup: '233', unitGroup: '2331', assessingAuthority: 'EA', mltssl: true, regional: true },
  { code: '233211', title: 'Civil Engineer', skillLevel: 1, majorGroup: '2', minorGroup: '233', unitGroup: '2332', assessingAuthority: 'EA', mltssl: true, regional: true, pmsol: true },
  { code: '233212', title: 'Geotechnical Engineer', skillLevel: 1, majorGroup: '2', minorGroup: '233', unitGroup: '2332', assessingAuthority: 'EA', mltssl: true, regional: true },
  { code: '233213', title: 'Quantity Surveyor', skillLevel: 1, majorGroup: '2', minorGroup: '233', unitGroup: '2332', assessingAuthority: 'AIQS', mltssl: true, regional: true, pmsol: true },
  { code: '233214', title: 'Structural Engineer', skillLevel: 1, majorGroup: '2', minorGroup: '233', unitGroup: '2332', assessingAuthority: 'EA', mltssl: true, regional: true },
  { code: '233215', title: 'Transport Engineer', skillLevel: 1, majorGroup: '2', minorGroup: '233', unitGroup: '2332', assessingAuthority: 'EA', mltssl: true, regional: true },
  { code: '233311', title: 'Electrical Engineer', skillLevel: 1, majorGroup: '2', minorGroup: '233', unitGroup: '2333', assessingAuthority: 'EA', mltssl: true, regional: true },
  { code: '233411', title: 'Electronics Engineer', skillLevel: 1, majorGroup: '2', minorGroup: '233', unitGroup: '2334', assessingAuthority: 'EA', mltssl: true, regional: true },
  { code: '233511', title: 'Industrial Engineer', skillLevel: 1, majorGroup: '2', minorGroup: '233', unitGroup: '2335', assessingAuthority: 'EA', mltssl: true, regional: true },
  { code: '233512', title: 'Mechanical Engineer', skillLevel: 1, majorGroup: '2', minorGroup: '233', unitGroup: '2335', assessingAuthority: 'EA', mltssl: true, regional: true, pmsol: true },
  { code: '233513', title: 'Production or Plant Engineer', skillLevel: 1, majorGroup: '2', minorGroup: '233', unitGroup: '2335', assessingAuthority: 'EA', mltssl: true, regional: true },
  { code: '233611', title: 'Mining Engineer (excluding Petroleum)', skillLevel: 1, majorGroup: '2', minorGroup: '233', unitGroup: '2336', assessingAuthority: 'EA', mltssl: true, regional: true },
  { code: '233612', title: 'Petroleum Engineer', skillLevel: 1, majorGroup: '2', minorGroup: '233', unitGroup: '2336', assessingAuthority: 'EA', mltssl: true, regional: true },
  { code: '233911', title: 'Aeronautical Engineer', skillLevel: 1, majorGroup: '2', minorGroup: '233', unitGroup: '2339', assessingAuthority: 'EA', mltssl: true, regional: true },
  { code: '233912', title: 'Agricultural Engineer', skillLevel: 1, majorGroup: '2', minorGroup: '233', unitGroup: '2339', assessingAuthority: 'EA', mltssl: true, regional: true },
  { code: '233913', title: 'Biomedical Engineer', skillLevel: 1, majorGroup: '2', minorGroup: '233', unitGroup: '2339', assessingAuthority: 'EA', mltssl: true, regional: true },
  { code: '233914', title: 'Engineering Technologist', skillLevel: 1, majorGroup: '2', minorGroup: '233', unitGroup: '2339', assessingAuthority: 'EA', mltssl: true, regional: true },
  { code: '233915', title: 'Environmental Engineer', skillLevel: 1, majorGroup: '2', minorGroup: '233', unitGroup: '2339', assessingAuthority: 'EA', mltssl: true, regional: true },
  { code: '233916', title: 'Naval Architect', skillLevel: 1, majorGroup: '2', minorGroup: '233', unitGroup: '2339', assessingAuthority: 'EA', mltssl: true, regional: true },
  
  // Medical Practitioners (25xx)
  { code: '253111', title: 'General Practitioner', skillLevel: 1, majorGroup: '2', minorGroup: '253', unitGroup: '2531', assessingAuthority: 'MBA', mltssl: true, regional: true, pmsol: true },
  { code: '253112', title: 'Resident Medical Officer', skillLevel: 1, majorGroup: '2', minorGroup: '253', unitGroup: '2531', assessingAuthority: 'MBA', mltssl: true, regional: true },
  { code: '253211', title: 'Anaesthetist', skillLevel: 1, majorGroup: '2', minorGroup: '253', unitGroup: '2532', assessingAuthority: 'MBA', mltssl: true, regional: true },
  { code: '253311', title: 'Specialist Physician (General Medicine)', skillLevel: 1, majorGroup: '2', minorGroup: '253', unitGroup: '2533', assessingAuthority: 'MBA', mltssl: true, regional: true },
  { code: '253312', title: 'Cardiologist', skillLevel: 1, majorGroup: '2', minorGroup: '253', unitGroup: '2533', assessingAuthority: 'MBA', mltssl: true, regional: true },
  { code: '253313', title: 'Clinical Haematologist', skillLevel: 1, majorGroup: '2', minorGroup: '253', unitGroup: '2533', assessingAuthority: 'MBA', mltssl: true, regional: true },
  { code: '253314', title: 'Medical Oncologist', skillLevel: 1, majorGroup: '2', minorGroup: '253', unitGroup: '2533', assessingAuthority: 'MBA', mltssl: true, regional: true },
  { code: '253315', title: 'Endocrinologist', skillLevel: 1, majorGroup: '2', minorGroup: '253', unitGroup: '2533', assessingAuthority: 'MBA', mltssl: true, regional: true },
  { code: '253316', title: 'Gastroenterologist', skillLevel: 1, majorGroup: '2', minorGroup: '253', unitGroup: '2533', assessingAuthority: 'MBA', mltssl: true, regional: true },
  { code: '253317', title: 'Intensive Care Specialist', skillLevel: 1, majorGroup: '2', minorGroup: '253', unitGroup: '2533', assessingAuthority: 'MBA', mltssl: true, regional: true },
  { code: '253318', title: 'Neurologist', skillLevel: 1, majorGroup: '2', minorGroup: '253', unitGroup: '2533', assessingAuthority: 'MBA', mltssl: true, regional: true },
  { code: '253321', title: 'Paediatrician', skillLevel: 1, majorGroup: '2', minorGroup: '253', unitGroup: '2533', assessingAuthority: 'MBA', mltssl: true, regional: true },
  { code: '253322', title: 'Renal Medicine Specialist', skillLevel: 1, majorGroup: '2', minorGroup: '253', unitGroup: '2533', assessingAuthority: 'MBA', mltssl: true, regional: true },
  { code: '253323', title: 'Rheumatologist', skillLevel: 1, majorGroup: '2', minorGroup: '253', unitGroup: '2533', assessingAuthority: 'MBA', mltssl: true, regional: true },
  { code: '253324', title: 'Thoracic Medicine Specialist', skillLevel: 1, majorGroup: '2', minorGroup: '253', unitGroup: '2533', assessingAuthority: 'MBA', mltssl: true, regional: true },
  { code: '253399', title: 'Specialist Physicians nec', skillLevel: 1, majorGroup: '2', minorGroup: '253', unitGroup: '2533', assessingAuthority: 'MBA', mltssl: true, regional: true },
  { code: '253411', title: 'Psychiatrist', skillLevel: 1, majorGroup: '2', minorGroup: '253', unitGroup: '2534', assessingAuthority: 'MBA', mltssl: true, regional: true },
  { code: '253511', title: 'Surgeon (General)', skillLevel: 1, majorGroup: '2', minorGroup: '253', unitGroup: '2535', assessingAuthority: 'MBA', mltssl: true, regional: true },
  { code: '253512', title: 'Cardiothoracic Surgeon', skillLevel: 1, majorGroup: '2', minorGroup: '253', unitGroup: '2535', assessingAuthority: 'MBA', mltssl: true, regional: true },
  { code: '253513', title: 'Neurosurgeon', skillLevel: 1, majorGroup: '2', minorGroup: '253', unitGroup: '2535', assessingAuthority: 'MBA', mltssl: true, regional: true },
  { code: '253514', title: 'Orthopaedic Surgeon', skillLevel: 1, majorGroup: '2', minorGroup: '253', unitGroup: '2535', assessingAuthority: 'MBA', mltssl: true, regional: true },
  { code: '253515', title: 'Otorhinolaryngologist', skillLevel: 1, majorGroup: '2', minorGroup: '253', unitGroup: '2535', assessingAuthority: 'MBA', mltssl: true, regional: true },
  { code: '253516', title: 'Paediatric Surgeon', skillLevel: 1, majorGroup: '2', minorGroup: '253', unitGroup: '2535', assessingAuthority: 'MBA', mltssl: true, regional: true },
  { code: '253517', title: 'Plastic and Reconstructive Surgeon', skillLevel: 1, majorGroup: '2', minorGroup: '253', unitGroup: '2535', assessingAuthority: 'MBA', mltssl: true, regional: true },
  { code: '253518', title: 'Urologist', skillLevel: 1, majorGroup: '2', minorGroup: '253', unitGroup: '2535', assessingAuthority: 'MBA', mltssl: true, regional: true },
  { code: '253521', title: 'Vascular Surgeon', skillLevel: 1, majorGroup: '2', minorGroup: '253', unitGroup: '2535', assessingAuthority: 'MBA', mltssl: true, regional: true },
  { code: '253911', title: 'Dermatologist', skillLevel: 1, majorGroup: '2', minorGroup: '253', unitGroup: '2539', assessingAuthority: 'MBA', mltssl: true, regional: true },
  { code: '253912', title: 'Emergency Medicine Specialist', skillLevel: 1, majorGroup: '2', minorGroup: '253', unitGroup: '2539', assessingAuthority: 'MBA', mltssl: true, regional: true },
  { code: '253913', title: 'Obstetrician and Gynaecologist', skillLevel: 1, majorGroup: '2', minorGroup: '253', unitGroup: '2539', assessingAuthority: 'MBA', mltssl: true, regional: true },
  { code: '253914', title: 'Ophthalmologist', skillLevel: 1, majorGroup: '2', minorGroup: '253', unitGroup: '2539', assessingAuthority: 'MBA', mltssl: true, regional: true },
  { code: '253915', title: 'Pathologist', skillLevel: 1, majorGroup: '2', minorGroup: '253', unitGroup: '2539', assessingAuthority: 'MBA', mltssl: true, regional: true },
  { code: '253916', title: 'Radiologist', skillLevel: 1, majorGroup: '2', minorGroup: '253', unitGroup: '2539', assessingAuthority: 'MBA', mltssl: true, regional: true },
  { code: '253999', title: 'Medical Practitioners nec', skillLevel: 1, majorGroup: '2', minorGroup: '253', unitGroup: '2539', assessingAuthority: 'MBA', mltssl: true, regional: true },

  // Nurses (2544)
  { code: '254411', title: 'Nurse Practitioner', skillLevel: 1, majorGroup: '2', minorGroup: '254', unitGroup: '2544', assessingAuthority: 'ANMAC', mltssl: true, regional: true, pmsol: true },
  { code: '254412', title: 'Registered Nurse (Aged Care)', skillLevel: 1, majorGroup: '2', minorGroup: '254', unitGroup: '2544', assessingAuthority: 'ANMAC', mltssl: true, regional: true, pmsol: true },
  { code: '254413', title: 'Registered Nurse (Child and Family Health)', skillLevel: 1, majorGroup: '2', minorGroup: '254', unitGroup: '2544', assessingAuthority: 'ANMAC', mltssl: true, regional: true },
  { code: '254414', title: 'Registered Nurse (Community Health)', skillLevel: 1, majorGroup: '2', minorGroup: '254', unitGroup: '2544', assessingAuthority: 'ANMAC', mltssl: true, regional: true },
  { code: '254415', title: 'Registered Nurse (Critical Care and Emergency)', skillLevel: 1, majorGroup: '2', minorGroup: '254', unitGroup: '2544', assessingAuthority: 'ANMAC', mltssl: true, regional: true, pmsol: true },
  { code: '254416', title: 'Registered Nurse (Developmental Disability)', skillLevel: 1, majorGroup: '2', minorGroup: '254', unitGroup: '2544', assessingAuthority: 'ANMAC', mltssl: true, regional: true },
  { code: '254417', title: 'Registered Nurse (Disability and Rehabilitation)', skillLevel: 1, majorGroup: '2', minorGroup: '254', unitGroup: '2544', assessingAuthority: 'ANMAC', mltssl: true, regional: true },
  { code: '254418', title: 'Registered Nurse (Medical)', skillLevel: 1, majorGroup: '2', minorGroup: '254', unitGroup: '2544', assessingAuthority: 'ANMAC', mltssl: true, regional: true, pmsol: true },
  { code: '254421', title: 'Registered Nurse (Medical Practice)', skillLevel: 1, majorGroup: '2', minorGroup: '254', unitGroup: '2544', assessingAuthority: 'ANMAC', mltssl: true, regional: true },
  { code: '254422', title: 'Registered Nurse (Mental Health)', skillLevel: 1, majorGroup: '2', minorGroup: '254', unitGroup: '2544', assessingAuthority: 'ANMAC', mltssl: true, regional: true, pmsol: true },
  { code: '254423', title: 'Registered Nurse (Perioperative)', skillLevel: 1, majorGroup: '2', minorGroup: '254', unitGroup: '2544', assessingAuthority: 'ANMAC', mltssl: true, regional: true },
  { code: '254424', title: 'Registered Nurse (Surgical)', skillLevel: 1, majorGroup: '2', minorGroup: '254', unitGroup: '2544', assessingAuthority: 'ANMAC', mltssl: true, regional: true, pmsol: true },
  { code: '254499', title: 'Registered Nurses nec', skillLevel: 1, majorGroup: '2', minorGroup: '254', unitGroup: '2544', assessingAuthority: 'ANMAC', mltssl: true, regional: true, pmsol: true },

  // Teachers (24xx)
  { code: '241111', title: 'Early Childhood (Pre-primary School) Teacher', skillLevel: 1, majorGroup: '2', minorGroup: '241', unitGroup: '2411', assessingAuthority: 'AITSL', mltssl: true, regional: true, pmsol: true },
  { code: '241213', title: 'Primary School Teacher', skillLevel: 1, majorGroup: '2', minorGroup: '241', unitGroup: '2412', assessingAuthority: 'AITSL', mltssl: true, regional: true },
  { code: '241311', title: 'Middle School Teacher', skillLevel: 1, majorGroup: '2', minorGroup: '241', unitGroup: '2413', assessingAuthority: 'AITSL', stsol: true, regional: true },
  { code: '241411', title: 'Secondary School Teacher', skillLevel: 1, majorGroup: '2', minorGroup: '241', unitGroup: '2414', assessingAuthority: 'AITSL', mltssl: true, regional: true },
  { code: '241511', title: 'Special Needs Teacher', skillLevel: 1, majorGroup: '2', minorGroup: '241', unitGroup: '2415', assessingAuthority: 'AITSL', mltssl: true, regional: true },
  { code: '241512', title: 'Teacher of the Hearing Impaired', skillLevel: 1, majorGroup: '2', minorGroup: '241', unitGroup: '2415', assessingAuthority: 'AITSL', mltssl: true, regional: true },
  { code: '241513', title: 'Teacher of the Sight Impaired', skillLevel: 1, majorGroup: '2', minorGroup: '241', unitGroup: '2415', assessingAuthority: 'AITSL', mltssl: true, regional: true },
  { code: '241599', title: 'Special Education Teachers nec', skillLevel: 1, majorGroup: '2', minorGroup: '241', unitGroup: '2415', assessingAuthority: 'AITSL', mltssl: true, regional: true },
  { code: '242111', title: 'University Lecturer', skillLevel: 1, majorGroup: '2', minorGroup: '242', unitGroup: '2421', assessingAuthority: 'VETASSESS', mltssl: true, regional: true },
  { code: '242211', title: 'Vocational Education Teacher', skillLevel: 1, majorGroup: '2', minorGroup: '242', unitGroup: '2422', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '249111', title: 'Education Adviser', skillLevel: 1, majorGroup: '2', minorGroup: '249', unitGroup: '2491', assessingAuthority: 'VETASSESS', mltssl: true, regional: true },
  { code: '249211', title: 'Art Teacher (Private Tuition)', skillLevel: 1, majorGroup: '2', minorGroup: '249', unitGroup: '2492', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '249212', title: 'Dance Teacher (Private Tuition)', skillLevel: 1, majorGroup: '2', minorGroup: '249', unitGroup: '2492', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '249213', title: 'Drama Teacher (Private Tuition)', skillLevel: 1, majorGroup: '2', minorGroup: '249', unitGroup: '2492', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '249214', title: 'Music Teacher (Private Tuition)', skillLevel: 1, majorGroup: '2', minorGroup: '249', unitGroup: '2492', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '249299', title: 'Private Tutors and Teachers nec', skillLevel: 1, majorGroup: '2', minorGroup: '249', unitGroup: '2492', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '249311', title: 'Teacher of English to Speakers of Other Languages', skillLevel: 1, majorGroup: '2', minorGroup: '249', unitGroup: '2493', assessingAuthority: 'VETASSESS', stsol: true, regional: true },

  // Technicians and Trades Workers (3xxx)
  { code: '312111', title: 'Architectural Draftsperson', skillLevel: 2, majorGroup: '3', minorGroup: '312', unitGroup: '3121', assessingAuthority: 'VETASSESS', mltssl: true, regional: true },
  { code: '312112', title: 'Building Associate', skillLevel: 2, majorGroup: '3', minorGroup: '312', unitGroup: '3121', assessingAuthority: 'VETASSESS', regional: true },
  { code: '312113', title: 'Building Inspector', skillLevel: 2, majorGroup: '3', minorGroup: '312', unitGroup: '3121', assessingAuthority: 'VETASSESS', mltssl: true, regional: true },
  { code: '312114', title: 'Construction Estimator', skillLevel: 2, majorGroup: '3', minorGroup: '312', unitGroup: '3121', assessingAuthority: 'VETASSESS', mltssl: true, regional: true },
  { code: '312115', title: 'Plumbing Inspector', skillLevel: 2, majorGroup: '3', minorGroup: '312', unitGroup: '3121', assessingAuthority: 'VETASSESS', mltssl: true, regional: true },
  { code: '312116', title: 'Surveying or Spatial Science Technician', skillLevel: 2, majorGroup: '3', minorGroup: '312', unitGroup: '3121', assessingAuthority: 'VETASSESS', regional: true },
  { code: '312199', title: 'Architectural, Building and Surveying Technicians nec', skillLevel: 2, majorGroup: '3', minorGroup: '312', unitGroup: '3121', assessingAuthority: 'VETASSESS', mltssl: true, regional: true },
  { code: '312211', title: 'Civil Engineering Draftsperson', skillLevel: 2, majorGroup: '3', minorGroup: '312', unitGroup: '3122', assessingAuthority: 'EA/VETASSESS', mltssl: true, regional: true },
  { code: '312212', title: 'Civil Engineering Technician', skillLevel: 2, majorGroup: '3', minorGroup: '312', unitGroup: '3122', assessingAuthority: 'VETASSESS', mltssl: true, regional: true },
  { code: '312311', title: 'Electrical Engineering Draftsperson', skillLevel: 2, majorGroup: '3', minorGroup: '312', unitGroup: '3123', assessingAuthority: 'EA', mltssl: true, regional: true },
  { code: '312312', title: 'Electrical Engineering Technician', skillLevel: 2, majorGroup: '3', minorGroup: '312', unitGroup: '3123', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '313111', title: 'Hardware Technician', skillLevel: 2, majorGroup: '3', minorGroup: '313', unitGroup: '3131', assessingAuthority: 'TRA', stsol: true, regional: true },
  { code: '313112', title: 'ICT Customer Support Officer', skillLevel: 2, majorGroup: '3', minorGroup: '313', unitGroup: '3131', assessingAuthority: 'ACS', stsol: true, regional: true },
  { code: '313113', title: 'Web Administrator', skillLevel: 2, majorGroup: '3', minorGroup: '313', unitGroup: '3131', assessingAuthority: 'ACS', stsol: true, regional: true },
  { code: '313199', title: 'ICT Support Technicians nec', skillLevel: 2, majorGroup: '3', minorGroup: '313', unitGroup: '3131', assessingAuthority: 'ACS', stsol: true, regional: true },
  { code: '313211', title: 'Radiocommunications Technician', skillLevel: 2, majorGroup: '3', minorGroup: '313', unitGroup: '3132', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '313212', title: 'Telecommunications Field Engineer', skillLevel: 2, majorGroup: '3', minorGroup: '313', unitGroup: '3132', assessingAuthority: 'EA', mltssl: true, regional: true },
  { code: '313213', title: 'Telecommunications Network Planner', skillLevel: 2, majorGroup: '3', minorGroup: '313', unitGroup: '3132', assessingAuthority: 'EA', mltssl: true, regional: true },
  { code: '313214', title: 'Telecommunications Technical Officer or Technologist', skillLevel: 2, majorGroup: '3', minorGroup: '313', unitGroup: '3132', assessingAuthority: 'EA', mltssl: true, regional: true },
  
  // Construction Trades (33xx)
  { code: '331111', title: 'Bricklayer', skillLevel: 3, majorGroup: '3', minorGroup: '331', unitGroup: '3311', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '331112', title: 'Stonemason', skillLevel: 3, majorGroup: '3', minorGroup: '331', unitGroup: '3311', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '331211', title: 'Carpenter and Joiner', skillLevel: 3, majorGroup: '3', minorGroup: '331', unitGroup: '3312', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '331212', title: 'Carpenter', skillLevel: 3, majorGroup: '3', minorGroup: '331', unitGroup: '3312', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '331213', title: 'Joiner', skillLevel: 3, majorGroup: '3', minorGroup: '331', unitGroup: '3312', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '332111', title: 'Floor Finisher', skillLevel: 3, majorGroup: '3', minorGroup: '332', unitGroup: '3321', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '332211', title: 'Painting Trades Worker', skillLevel: 3, majorGroup: '3', minorGroup: '332', unitGroup: '3322', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '333111', title: 'Glazier', skillLevel: 3, majorGroup: '3', minorGroup: '333', unitGroup: '3331', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '333211', title: 'Fibrous Plasterer', skillLevel: 3, majorGroup: '3', minorGroup: '333', unitGroup: '3332', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '333212', title: 'Solid Plasterer', skillLevel: 3, majorGroup: '3', minorGroup: '333', unitGroup: '3332', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '333311', title: 'Roof Tiler', skillLevel: 3, majorGroup: '3', minorGroup: '333', unitGroup: '3333', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '333411', title: 'Wall and Floor Tiler', skillLevel: 3, majorGroup: '3', minorGroup: '333', unitGroup: '3334', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '334111', title: 'Plumber (General)', skillLevel: 3, majorGroup: '3', minorGroup: '334', unitGroup: '3341', assessingAuthority: 'TRA', mltssl: true, regional: true, pmsol: true },
  { code: '334112', title: 'Airconditioning and Mechanical Services Plumber', skillLevel: 3, majorGroup: '3', minorGroup: '334', unitGroup: '3341', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '334113', title: 'Drainer', skillLevel: 3, majorGroup: '3', minorGroup: '334', unitGroup: '3341', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '334114', title: 'Gasfitter', skillLevel: 3, majorGroup: '3', minorGroup: '334', unitGroup: '3341', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '334115', title: 'Roof Plumber', skillLevel: 3, majorGroup: '3', minorGroup: '334', unitGroup: '3341', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '341111', title: 'Electrician (General)', skillLevel: 3, majorGroup: '3', minorGroup: '341', unitGroup: '3411', assessingAuthority: 'TRA', mltssl: true, regional: true, pmsol: true },
  { code: '341112', title: 'Electrician (Special Class)', skillLevel: 3, majorGroup: '3', minorGroup: '341', unitGroup: '3411', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '341113', title: 'Lift Mechanic', skillLevel: 3, majorGroup: '3', minorGroup: '341', unitGroup: '3411', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '342111', title: 'Airconditioning and Refrigeration Mechanic', skillLevel: 3, majorGroup: '3', minorGroup: '342', unitGroup: '3421', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '342211', title: 'Electrical Linesworker', skillLevel: 3, majorGroup: '3', minorGroup: '342', unitGroup: '3422', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '342212', title: 'Technical Cable Jointer', skillLevel: 3, majorGroup: '3', minorGroup: '342', unitGroup: '3422', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '342311', title: 'Business Machine Mechanic', skillLevel: 3, majorGroup: '3', minorGroup: '342', unitGroup: '3423', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '342313', title: 'Electronic Equipment Trades Worker', skillLevel: 3, majorGroup: '3', minorGroup: '342', unitGroup: '3423', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '342314', title: 'Electronic Instrument Trades Worker (General)', skillLevel: 3, majorGroup: '3', minorGroup: '342', unitGroup: '3423', assessingAuthority: 'TRA', mltssl: true, regional: true },
  
  // Automotive Trades (32xx)
  { code: '321111', title: 'Automotive Electrician', skillLevel: 3, majorGroup: '3', minorGroup: '321', unitGroup: '3211', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '321211', title: 'Motor Mechanic (General)', skillLevel: 3, majorGroup: '3', minorGroup: '321', unitGroup: '3212', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '321212', title: 'Diesel Motor Mechanic', skillLevel: 3, majorGroup: '3', minorGroup: '321', unitGroup: '3212', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '321213', title: 'Motorcycle Mechanic', skillLevel: 3, majorGroup: '3', minorGroup: '321', unitGroup: '3212', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '321214', title: 'Small Engine Mechanic', skillLevel: 3, majorGroup: '3', minorGroup: '321', unitGroup: '3212', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '322211', title: 'Sheetmetal Trades Worker', skillLevel: 3, majorGroup: '3', minorGroup: '322', unitGroup: '3222', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '322311', title: 'Metal Fabricator', skillLevel: 3, majorGroup: '3', minorGroup: '322', unitGroup: '3223', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '322312', title: 'Pressure Welder', skillLevel: 3, majorGroup: '3', minorGroup: '322', unitGroup: '3223', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '322313', title: 'Welder (First Class)', skillLevel: 3, majorGroup: '3', minorGroup: '322', unitGroup: '3223', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '323111', title: 'Aircraft Maintenance Engineer (Avionics)', skillLevel: 3, majorGroup: '3', minorGroup: '323', unitGroup: '3231', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '323112', title: 'Aircraft Maintenance Engineer (Mechanical)', skillLevel: 3, majorGroup: '3', minorGroup: '323', unitGroup: '3231', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '323113', title: 'Aircraft Maintenance Engineer (Structures)', skillLevel: 3, majorGroup: '3', minorGroup: '323', unitGroup: '3231', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '323211', title: 'Fitter (General)', skillLevel: 3, majorGroup: '3', minorGroup: '323', unitGroup: '3232', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '323212', title: 'Fitter and Turner', skillLevel: 3, majorGroup: '3', minorGroup: '323', unitGroup: '3232', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '323213', title: 'Fitter-Welder', skillLevel: 3, majorGroup: '3', minorGroup: '323', unitGroup: '3232', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '323214', title: 'Metal Machinist (First Class)', skillLevel: 3, majorGroup: '3', minorGroup: '323', unitGroup: '3232', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '323215', title: 'Textile, Clothing and Footwear Mechanic', skillLevel: 3, majorGroup: '3', minorGroup: '323', unitGroup: '3232', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '323299', title: 'Metal Fitters and Machinists nec', skillLevel: 3, majorGroup: '3', minorGroup: '323', unitGroup: '3232', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '323314', title: 'Precision Instrument Maker and Repairer', skillLevel: 3, majorGroup: '3', minorGroup: '323', unitGroup: '3233', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '323315', title: 'Watch and Clock Maker and Repairer', skillLevel: 3, majorGroup: '3', minorGroup: '323', unitGroup: '3233', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '324111', title: 'Panelbeater', skillLevel: 3, majorGroup: '3', minorGroup: '324', unitGroup: '3241', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '324211', title: 'Vehicle Body Builder', skillLevel: 3, majorGroup: '3', minorGroup: '324', unitGroup: '3242', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '324212', title: 'Vehicle Trimmer', skillLevel: 3, majorGroup: '3', minorGroup: '324', unitGroup: '3242', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '324311', title: 'Vehicle Painter', skillLevel: 3, majorGroup: '3', minorGroup: '324', unitGroup: '3243', assessingAuthority: 'TRA', mltssl: true, regional: true },

  // Food Trades (35xx)
  { code: '351111', title: 'Baker', skillLevel: 3, majorGroup: '3', minorGroup: '351', unitGroup: '3511', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '351112', title: 'Pastrycook', skillLevel: 3, majorGroup: '3', minorGroup: '351', unitGroup: '3511', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '351211', title: 'Butcher or Smallgoods Maker', skillLevel: 3, majorGroup: '3', minorGroup: '351', unitGroup: '3512', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '351311', title: 'Chef', skillLevel: 2, majorGroup: '3', minorGroup: '351', unitGroup: '3513', assessingAuthority: 'TRA', mltssl: true, regional: true, pmsol: true },
  { code: '351411', title: 'Cook', skillLevel: 3, majorGroup: '3', minorGroup: '351', unitGroup: '3514', assessingAuthority: 'TRA', mltssl: true, regional: true },

  // Skilled Animal and Horticultural Workers (36xx)
  { code: '361111', title: 'Dog Handler or Trainer', skillLevel: 3, majorGroup: '3', minorGroup: '361', unitGroup: '3611', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '361112', title: 'Horse Trainer', skillLevel: 3, majorGroup: '3', minorGroup: '361', unitGroup: '3611', assessingAuthority: 'TRA', stsol: true, regional: true },
  { code: '361211', title: 'Shearer', skillLevel: 3, majorGroup: '3', minorGroup: '361', unitGroup: '3612', assessingAuthority: 'VETASSESS', mltssl: true, regional: true },
  { code: '361311', title: 'Veterinary Nurse', skillLevel: 3, majorGroup: '3', minorGroup: '361', unitGroup: '3613', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '361411', title: 'Florist', skillLevel: 3, majorGroup: '3', minorGroup: '361', unitGroup: '3614', assessingAuthority: 'TRA', stsol: true, regional: true },
  { code: '361412', title: 'Gardener (General)', skillLevel: 3, majorGroup: '3', minorGroup: '361', unitGroup: '3614', assessingAuthority: 'TRA', stsol: true, regional: true },
  { code: '361413', title: 'Arborist', skillLevel: 3, majorGroup: '3', minorGroup: '361', unitGroup: '3614', assessingAuthority: 'TRA', stsol: true, regional: true },
  { code: '361414', title: 'Landscape Gardener', skillLevel: 3, majorGroup: '3', minorGroup: '361', unitGroup: '3614', assessingAuthority: 'TRA', stsol: true, regional: true },
  { code: '361511', title: 'Greenkeeper', skillLevel: 3, majorGroup: '3', minorGroup: '361', unitGroup: '3615', assessingAuthority: 'TRA', stsol: true, regional: true },

  // Other Technicians and Trades
  { code: '392111', title: 'Print Finisher', skillLevel: 3, majorGroup: '3', minorGroup: '392', unitGroup: '3921', assessingAuthority: 'TRA', stsol: true, regional: true },
  { code: '392211', title: 'Graphic Pre-press Trades Worker', skillLevel: 3, majorGroup: '3', minorGroup: '392', unitGroup: '3922', assessingAuthority: 'TRA', stsol: true, regional: true },
  { code: '392311', title: 'Printing Machinist', skillLevel: 3, majorGroup: '3', minorGroup: '392', unitGroup: '3923', assessingAuthority: 'TRA', stsol: true, regional: true },
  { code: '392312', title: 'Small Offset Printer', skillLevel: 3, majorGroup: '3', minorGroup: '392', unitGroup: '3923', assessingAuthority: 'TRA', stsol: true, regional: true },
  { code: '394111', title: 'Cabinetmaker', skillLevel: 3, majorGroup: '3', minorGroup: '394', unitGroup: '3941', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '394213', title: 'Wood Machinist', skillLevel: 3, majorGroup: '3', minorGroup: '394', unitGroup: '3942', assessingAuthority: 'TRA', stsol: true, regional: true },
  { code: '394214', title: 'Wood Turner', skillLevel: 3, majorGroup: '3', minorGroup: '394', unitGroup: '3942', assessingAuthority: 'TRA', stsol: true, regional: true },
  { code: '394299', title: 'Wood Machinists and Other Wood Trades Workers nec', skillLevel: 3, majorGroup: '3', minorGroup: '394', unitGroup: '3942', assessingAuthority: 'TRA', stsol: true, regional: true },
  { code: '399111', title: 'Boat Builder and Repairer', skillLevel: 3, majorGroup: '3', minorGroup: '399', unitGroup: '3991', assessingAuthority: 'TRA', stsol: true, regional: true },
  { code: '399112', title: 'Shipwright', skillLevel: 3, majorGroup: '3', minorGroup: '399', unitGroup: '3991', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '399211', title: 'Chemical Plant Operator', skillLevel: 3, majorGroup: '3', minorGroup: '399', unitGroup: '3992', assessingAuthority: 'TRA', stsol: true, regional: true },
  { code: '399212', title: 'Gas or Petroleum Operator', skillLevel: 3, majorGroup: '3', minorGroup: '399', unitGroup: '3992', assessingAuthority: 'TRA', stsol: true, regional: true },
  { code: '399213', title: 'Power Generation Plant Operator', skillLevel: 3, majorGroup: '3', minorGroup: '399', unitGroup: '3992', assessingAuthority: 'TRA', stsol: true, regional: true },
  { code: '399311', title: 'Gallery or Museum Technician', skillLevel: 3, majorGroup: '3', minorGroup: '399', unitGroup: '3993', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '399411', title: 'Jeweller', skillLevel: 3, majorGroup: '3', minorGroup: '399', unitGroup: '3994', assessingAuthority: 'TRA', mltssl: true, regional: true },
  { code: '399512', title: 'Camera Operator (Film, Television or Video)', skillLevel: 3, majorGroup: '3', minorGroup: '399', unitGroup: '3995', assessingAuthority: 'TRA', stsol: true, regional: true },
  { code: '399513', title: 'Light Technician', skillLevel: 3, majorGroup: '3', minorGroup: '399', unitGroup: '3995', assessingAuthority: 'TRA', stsol: true, regional: true },
  { code: '399514', title: 'Make Up Artist', skillLevel: 3, majorGroup: '3', minorGroup: '399', unitGroup: '3995', assessingAuthority: 'TRA', stsol: true, regional: true },
  { code: '399515', title: 'Musical Instrument Maker or Repairer', skillLevel: 3, majorGroup: '3', minorGroup: '399', unitGroup: '3995', assessingAuthority: 'TRA', stsol: true, regional: true },
  { code: '399516', title: 'Sound Technician', skillLevel: 3, majorGroup: '3', minorGroup: '399', unitGroup: '3995', assessingAuthority: 'TRA', stsol: true, regional: true },
  { code: '399517', title: 'Television Equipment Operator', skillLevel: 3, majorGroup: '3', minorGroup: '399', unitGroup: '3995', assessingAuthority: 'TRA', stsol: true, regional: true },
  { code: '399611', title: 'Signwriter', skillLevel: 3, majorGroup: '3', minorGroup: '399', unitGroup: '3996', assessingAuthority: 'TRA', stsol: true, regional: true },
  { code: '399911', title: 'Diver', skillLevel: 3, majorGroup: '3', minorGroup: '399', unitGroup: '3999', assessingAuthority: 'VETASSESS', mltssl: true, regional: true },
  { code: '399912', title: 'Interior Decorator', skillLevel: 3, majorGroup: '3', minorGroup: '399', unitGroup: '3999', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '399913', title: 'Optical Dispenser', skillLevel: 3, majorGroup: '3', minorGroup: '399', unitGroup: '3999', assessingAuthority: 'TRA', stsol: true, regional: true },
  { code: '399914', title: 'Optical Mechanic', skillLevel: 3, majorGroup: '3', minorGroup: '399', unitGroup: '3999', assessingAuthority: 'TRA', stsol: true, regional: true },
  { code: '399915', title: 'Photographer', skillLevel: 3, majorGroup: '3', minorGroup: '399', unitGroup: '3999', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '399916', title: 'Plastics Technician', skillLevel: 3, majorGroup: '3', minorGroup: '399', unitGroup: '3999', assessingAuthority: 'TRA', stsol: true, regional: true },
  { code: '399917', title: 'Professional Sports Person (nec)', skillLevel: 3, majorGroup: '3', minorGroup: '399', unitGroup: '3999', assessingAuthority: 'VETASSESS', mltssl: true, regional: true },
  { code: '399918', title: 'Security Consultant', skillLevel: 3, majorGroup: '3', minorGroup: '399', unitGroup: '3999', assessingAuthority: 'VETASSESS', stsol: true, regional: true },
  { code: '399999', title: 'Technicians and Trades Workers nec', skillLevel: 3, majorGroup: '3', minorGroup: '399', unitGroup: '3999', assessingAuthority: 'TRA/VETASSESS', stsol: true, regional: true },

  // Additional common occupations
  { code: '070199', title: 'Managing Director', skillLevel: 1, majorGroup: '0', minorGroup: '070', unitGroup: '0701' },
  { code: '070299', title: 'Company Director', skillLevel: 1, majorGroup: '0', minorGroup: '070', unitGroup: '0702' },
];

// Helper function to search occupations
export function searchANZSCO(query: string): ANZSCOOccupation[] {
  const lowerQuery = query.toLowerCase();
  return anzscoOccupations.filter(occ => 
    occ.code.includes(query) ||
    occ.title.toLowerCase().includes(lowerQuery)
  );
}

// Get occupation by code
export function getOccupationByCode(code: string): ANZSCOOccupation | undefined {
  return anzscoOccupations.find(occ => occ.code === code);
}

// Get occupations by major group
export function getOccupationsByMajorGroup(group: string): ANZSCOOccupation[] {
  return anzscoOccupations.filter(occ => occ.majorGroup === group);
}

// Get occupations on MLTSSL
export function getMLTSSLOccupations(): ANZSCOOccupation[] {
  return anzscoOccupations.filter(occ => occ.mltssl);
}

// Get occupations on STSOL
export function getSTSOLoccupations(): ANZSCOOccupation[] {
  return anzscoOccupations.filter(occ => occ.stsol);
}

// Get PMSOL occupations
export function getPMSOLOccupations(): ANZSCOOccupation[] {
  return anzscoOccupations.filter(occ => occ.pmsol);
}

// Get occupations by assessing authority
export function getOccupationsByAuthority(authority: string): ANZSCOOccupation[] {
  return anzscoOccupations.filter(occ => 
    occ.assessingAuthority?.includes(authority)
  );
}

// Export count
export const totalOccupations = anzscoOccupations.length;
