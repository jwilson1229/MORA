import { ProblemSolutionMap } from '../types/ProblemSolution';

export const problemSolutionMap: ProblemSolutionMap = {
  humidityspike: [
    {
      name: 'Crop Humidity Defense Kit',
      bundleName: 'Crop Humidity Defense Kit',
      description: 'Detects high humidity levels which could lead to fungal crop disease.',
      requiredProductNames: [
        'Air Humidity Sensor',
        'Environmental Sensor Kit',
      ],
      tags: ['humidity', 'disease', 'greenhouse', 'risk'],
      problem: 'Sudden spike in humidity threatening crop health',
      store: 'ag',
    },
  ],
  drought: [
    {
      name: 'Drought Survival Bundle',
      bundleName: 'Drought Survival Bundle',
      description: 'Provides moisture-level data and irrigation tools to combat drought.',
      requiredProductNames: [
        'Soil Moisture Sensor v2.0',
        'Irrigation Pump Controller',
        'Solar Water Pump Kit',
      ],
      tags: ['drought', 'irrigation', 'moisture', 'soil'],
      problem: 'Prolonged dry conditions affecting irrigation and soil moisture',
      store: 'ag',
    },
  ],
  frost: [
    {
      name: 'Frost Shield Bundle',
      bundleName: 'Frost Shield Bundle',
      description: 'Prepares farms for incoming frost with environmental sensors and alerts.',
      requiredProductNames: [
        'Temperature Sensor',
        'Weather Station Kit',
      ],
      tags: ['frost', 'temperature', 'climate'],
      problem: 'Sudden frost warning threatening crops',
      store: 'ag',
    },
  ],
  'extreme heat': [
    {
      name: 'Extreme Heat Defense Kit',
      bundleName: 'Extreme Heat Defense Kit',
      description:
        'Protects crops and workers from extreme heat using temperature monitoring and shade control technologies.',
      requiredProductNames: [
        'Temperature and Humidity Sensor',
        'UV Sensor (GUVA-S12SD)',
        'Smart Shade Controller'
      ],
      tags: ['extreme heat', 'temperature', 'uv', 'climate', 'heatwave'],
      problem: 'Extreme heat conditions affecting crop health and worker safety',
      store: 'ag',
    }
  ],
  pestinfestation: [
    {
      name: 'Pest Patrol Kit',
      bundleName: 'Pest Patrol Kit',
      description: 'Detects and deters pests with real-time sensing and ultrasonic deterrent.',
      requiredProductNames: [
        'Ultrasonic Pest Repeller',
        'Insect Monitoring Trap',
      ],
      tags: ['pests', 'insects', 'crop protection'],
      problem: 'Increased pest activity threatening crop yields',
      store: 'ag',
    },
  ],
  soilacidity: [
    {
      name: 'Soil pH Balance Bundle',
      bundleName: 'Soil pH Balance Bundle',
      description: 'Monitors and manages soil acidity levels to optimize growth conditions.',
      requiredProductNames: [
        'Analog pH Sensor Kit',
        'Soil Testing Kit',
      ],
      tags: ['soil', 'ph', 'acidity'],
      problem: 'Imbalanced soil acidity disrupting crop development',
      store: 'ag',
    },
  ],
  floodrisk: [
    {
      name: 'Flood Alert and Drainage Kit',
      bundleName: 'Flood Alert and Drainage Kit',
      description: 'Monitors water levels and prepares drainage control systems.',
      requiredProductNames: [
        'Water Level Sensor',
        'Drainage Control Valve',
      ],
      tags: ['flood', 'water', 'drainage', 'sensor'],
      problem: 'High flood risk due to seasonal rain or irrigation overflow',
      store: 'ag',
    },
  ],

  // MORA-SOLAR BUNDLES
  'cloud risk': [
    { 
      name: 'Solar Power Bundle',
      bundleName: 'Solar Power Bundle',
      description: 'Complete solar power system for off-grid applications.',
      requiredProductNames: [
        '12V 50Ah LiFePO4 Battery',
        'IoT Solar Controller with WiFi',
        'Solar Panel Mounting Brackets (Adjustable)',
      ],
      tags: ['solar', 'mounting', 'brackets', 'hardware'],
      problem: 'Cloud coverage reducing solar efficiency',
      store: 'solar',
    },
  ],

  // MORA-WATER BUNDLES
  'water shortage': [
    {
      name: 'Water Access Bundle',
      bundleName: 'Water Access Bundle',
      description: 'Improves access to clean water with pumps and filtration.',
      requiredProductNames: [
        'Portable Water Pump',
        'Ceramic Water Filter Kit',
      ],
      tags: ['water', 'pump', 'filtration'],
      problem: 'Limited access to potable water in rural regions',
      store: 'water',
    },
  ],

  // MORA-STEM BUNDLES
  'stem education': [
    {
      name: 'Mobile STEM Lab Kit',
      bundleName: 'Mobile STEM Lab Kit',
      description: 'All-in-one mobile learning kit for remote STEM education.',
      requiredProductNames: [
        'Raspberry Pi Pico with Accessories',
        'STEM Robotics Kit with Sensors',
        'Breadboard and Jumper Wire Set',
      ],
      tags: ['stem', 'education', 'lab', 'science'],
      problem: 'Lack of access to practical STEM education resources',
      store: 'stem',
    }
  ],

  // MORA-DX BUNDLES
  'diagnostics demand': [
    {
      name: 'Field Diagnostics Bundle',
      bundleName: 'Field Diagnostics Bundle',
      description: 'Portable sensors and kits for diagnostics in remote regions.',
      requiredProductNames: [
        'Digital Temperature Probe',
        'IoT Diagnostic Logger',
        'Remote Monitoring Starter Kit'
      ],
      tags: ['dx', 'sensor', 'monitoring'],
      problem: 'Need for local diagnostics infrastructure in field settings',
      store: 'dx',
    },
  ],
};

export type ProblemType = keyof typeof problemSolutionMap;