import React, { useState, useMemo, useEffect } from "react";
import { supabase } from "./supabaseClient";
import * as XLSX from "xlsx";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  LayoutDashboard, Target, TrendingUp, Users, Megaphone, Settings,
  Search, Plus, ChevronDown, ChevronUp, ChevronRight, ChevronLeft, MoreHorizontal, Circle,
  Star, Mountain, UserCheck, Play, Home, List, Trophy, User, X, Smartphone, Monitor,
  LayoutGrid, GitBranch, FolderGit2, CalendarRange, ListTodo, Clock, Pencil, Menu, Trash2, Table, Download
} from "lucide-react";

/* ---------------- Shared data (single source of truth) ---------------- */

const initialKpis = []; /*
  {
    "id": 1,
    "name": "No of digital enquiry resulted in sales - Domestic",
    "unit": " Nos",
    "target": 0.0,
    "direction": "higher",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Digital Marketing",
    "history": [
      {
        "d": "W1",
        "v": 5500.0
      },
      {
        "d": "W2",
        "v": 5500.0
      },
      {
        "d": "W3",
        "v": 5500.0
      },
      {
        "d": "W4",
        "v": 6000.0
      },
      {
        "d": "W5",
        "v": 6000.0
      },
      {
        "d": "W6",
        "v": 6000.0
      },
      {
        "d": "W7",
        "v": 6500.0
      },
      {
        "d": "W8",
        "v": 6500.0
      },
      {
        "d": "W9",
        "v": 6500.0
      },
      {
        "d": "W10",
        "v": 7000.0
      },
      {
        "d": "W11",
        "v": 7000.0
      },
      {
        "d": "W12",
        "v": 7000.0
      }
    ]
  },
  {
    "id": 2,
    "name": "No of machine sold through DM - Domestic",
    "unit": " Nos",
    "target": 400.0,
    "direction": "higher",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Digital Marketing",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 3,
    "name": "No of enquiry generated",
    "unit": " Nos",
    "target": 75000.0,
    "direction": "higher",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Digital Marketing",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 4,
    "name": "Digital Promotion cost per sale - domestic",
    "unit": " INR/MC",
    "target": 32000.0,
    "direction": "lower",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Digital Marketing",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 5,
    "name": "No of tender leads given",
    "unit": " Nos",
    "target": 0.0,
    "direction": "higher",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Digital Marketing",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 6,
    "name": "No of digital enquiry resulted in sales - IB",
    "unit": " Nos",
    "target": 0.0,
    "direction": "higher",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Digital Marketing",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 7,
    "name": "No of machine sold through DM - IB",
    "unit": " Nos",
    "target": 0.0,
    "direction": "higher",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Digital Marketing",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 8,
    "name": "No of enquiry generated",
    "unit": " Nos",
    "target": 0.0,
    "direction": "higher",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Digital Marketing",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 9,
    "name": "Digital Promotion cost per sale - IB",
    "unit": " INR/MC",
    "target": 0.0,
    "direction": "lower",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Digital Marketing",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 10,
    "name": "No of dealers onboarded by digital - Domestic",
    "unit": " Nos",
    "target": 0.0,
    "direction": "higher",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Digital Marketing",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 11,
    "name": "No of enquiry generated",
    "unit": " Nos",
    "target": 0.0,
    "direction": "higher",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Digital Marketing",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 12,
    "name": "Digital Promotion cost per dealer onboarded- domestic",
    "unit": " INR",
    "target": 0.0,
    "direction": "lower",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Digital Marketing",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 13,
    "name": "No of dealers onboarded  - IB",
    "unit": " Nos",
    "target": 0.0,
    "direction": "higher",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Digital Marketing",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 14,
    "name": "No of enquiry generated",
    "unit": " Nos",
    "target": 0.0,
    "direction": "higher",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Digital Marketing",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 15,
    "name": "Digital Promotion cost per dealer onboarded- IB",
    "unit": " INR",
    "target": 0.0,
    "direction": "lower",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Digital Marketing",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 16,
    "name": "Branding Communications",
    "unit": " Nos",
    "target": 0.0,
    "direction": "higher",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Digital Marketing",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 17,
    "name": "No of views videos",
    "unit": " Nos",
    "target": 0,
    "direction": "higher",
    "team": "Video Production",
    "owner": "Jefrin",
    "kra": "Video Production",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 18,
    "name": "No of posting of videos",
    "unit": " Nos",
    "target": 650.0,
    "direction": "higher",
    "team": "Video Production",
    "owner": "Jefrin",
    "kra": "Video Production",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 19,
    "name": "No of video done by internal team",
    "unit": " Nos",
    "target": 600.0,
    "direction": "higher",
    "team": "Video Production",
    "owner": "Jefrin",
    "kra": "Video Production",
    "history": [
      {
        "d": "W1",
        "v": 30.0
      },
      {
        "d": "W2",
        "v": 30.0
      },
      {
        "d": "W3",
        "v": 30.0
      },
      {
        "d": "W4",
        "v": 40.0
      },
      {
        "d": "W5",
        "v": 40.0
      },
      {
        "d": "W6",
        "v": 40.0
      },
      {
        "d": "W7",
        "v": 50.0
      },
      {
        "d": "W8",
        "v": 50.0
      },
      {
        "d": "W9",
        "v": 60.0
      },
      {
        "d": "W10",
        "v": 70.0
      },
      {
        "d": "W11",
        "v": 80.0
      },
      {
        "d": "W12",
        "v": 80.0
      }
    ]
  },
  {
    "id": 20,
    "name": "No of video done by external agency",
    "unit": " Nos",
    "target": 50.0,
    "direction": "higher",
    "team": "Video Production",
    "owner": "Jefrin",
    "kra": "Video Production",
    "history": [
      {
        "d": "W1",
        "v": 0.0
      },
      {
        "d": "W2",
        "v": 0.0
      },
      {
        "d": "W3",
        "v": 5.0
      },
      {
        "d": "W4",
        "v": 5.0
      },
      {
        "d": "W5",
        "v": 5.0
      },
      {
        "d": "W6",
        "v": 5.0
      },
      {
        "d": "W7",
        "v": 5.0
      },
      {
        "d": "W8",
        "v": 5.0
      },
      {
        "d": "W9",
        "v": 5.0
      },
      {
        "d": "W10",
        "v": 5.0
      },
      {
        "d": "W11",
        "v": 5.0
      },
      {
        "d": "W12",
        "v": 5.0
      }
    ]
  },
  {
    "id": 21,
    "name": "No of reach of poster",
    "unit": " Nos",
    "target": 0.0,
    "direction": "higher",
    "team": "Graphic Designing",
    "owner": "Sandeep",
    "kra": "Graphic Design",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 22,
    "name": "No of postings of poster - Total",
    "unit": " Nos",
    "target": 150.0,
    "direction": "higher",
    "team": "Graphic Designing",
    "owner": "Sandeep",
    "kra": "Graphic Design",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 23,
    "name": "No of postings of poster IB",
    "unit": " Nos",
    "target": 75.0,
    "direction": "higher",
    "team": "Graphic Designing",
    "owner": "Sandeep",
    "kra": "Graphic Design",
    "history": [
      {
        "d": "W1",
        "v": 8.0
      },
      {
        "d": "W2",
        "v": 8.0
      },
      {
        "d": "W3",
        "v": 8.0
      },
      {
        "d": "W4",
        "v": 10.0
      },
      {
        "d": "W5",
        "v": 10.0
      },
      {
        "d": "W6",
        "v": 10.0
      },
      {
        "d": "W7",
        "v": 10.0
      },
      {
        "d": "W8",
        "v": 12.0
      },
      {
        "d": "W9",
        "v": 12.0
      },
      {
        "d": "W10",
        "v": 12.0
      },
      {
        "d": "W11",
        "v": 12.0
      },
      {
        "d": "W12",
        "v": 12.0
      }
    ]
  },
  {
    "id": 24,
    "name": "No of postings of poster Domestic",
    "unit": " Nos",
    "target": 75.0,
    "direction": "higher",
    "team": "Graphic Designing",
    "owner": "Sandeep",
    "kra": "Graphic Design",
    "history": [
      {
        "d": "W1",
        "v": 6.0
      },
      {
        "d": "W2",
        "v": 6.0
      },
      {
        "d": "W3",
        "v": 6.0
      },
      {
        "d": "W4",
        "v": 8.0
      },
      {
        "d": "W5",
        "v": 8.0
      },
      {
        "d": "W6",
        "v": 8.0
      },
      {
        "d": "W7",
        "v": 10.0
      },
      {
        "d": "W8",
        "v": 10.0
      },
      {
        "d": "W9",
        "v": 10.0
      },
      {
        "d": "W10",
        "v": 10.0
      },
      {
        "d": "W11",
        "v": 10.0
      },
      {
        "d": "W12",
        "v": 10.0
      }
    ]
  },
  {
    "id": 25,
    "name": "Website traffic",
    "unit": " Nos",
    "target": 930000.0,
    "direction": "higher",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Digital Marketing",
    "history": [
      {
        "d": "W1",
        "v": 110000.0
      },
      {
        "d": "W2",
        "v": 160000.0
      },
      {
        "d": "W3",
        "v": 210000.0
      },
      {
        "d": "W4",
        "v": 260000.0
      },
      {
        "d": "W5",
        "v": 330000.0
      },
      {
        "d": "W6",
        "v": 400000.0
      },
      {
        "d": "W7",
        "v": 470000.0
      },
      {
        "d": "W8",
        "v": 540000.0
      },
      {
        "d": "W9",
        "v": 630000.0
      },
      {
        "d": "W10",
        "v": 720000.0
      },
      {
        "d": "W11",
        "v": 810000.0
      },
      {
        "d": "W12",
        "v": 930000.0
      }
    ]
  },
  {
    "id": 26,
    "name": "No of Website improvements",
    "unit": " Nos",
    "target": 20.0,
    "direction": "higher",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Digital Marketing",
    "history": [
      {
        "d": "W1",
        "v": 1.0
      },
      {
        "d": "W2",
        "v": 1.0
      },
      {
        "d": "W3",
        "v": 1.0
      },
      {
        "d": "W4",
        "v": 1.0
      },
      {
        "d": "W5",
        "v": 2.0
      },
      {
        "d": "W6",
        "v": 2.0
      },
      {
        "d": "W7",
        "v": 2.0
      },
      {
        "d": "W8",
        "v": 2.0
      },
      {
        "d": "W9",
        "v": 2.0
      },
      {
        "d": "W10",
        "v": 2.0
      },
      {
        "d": "W11",
        "v": 2.0
      },
      {
        "d": "W12",
        "v": 2.0
      }
    ]
  },
  {
    "id": 27,
    "name": "No of reputed media coverage",
    "unit": " Nos",
    "target": 10.0,
    "direction": "higher",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Digital Marketing",
    "history": [
      {
        "d": "W1",
        "v": 1.0
      },
      {
        "d": "W2",
        "v": 1.0
      },
      {
        "d": "W3",
        "v": 2.0
      },
      {
        "d": "W4",
        "v": 2.0
      }
    ]
  },
  {
    "id": 28,
    "name": "No of Internal communication",
    "unit": " Nos",
    "target": 20.0,
    "direction": "higher",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Digital Marketing",
    "history": [
      {
        "d": "W1",
        "v": 1.0
      },
      {
        "d": "W2",
        "v": 1.0
      },
      {
        "d": "W3",
        "v": 1.0
      },
      {
        "d": "W4",
        "v": 1.0
      },
      {
        "d": "W5",
        "v": 2.0
      },
      {
        "d": "W6",
        "v": 2.0
      },
      {
        "d": "W7",
        "v": 2.0
      },
      {
        "d": "W8",
        "v": 2.0
      },
      {
        "d": "W9",
        "v": 2.0
      },
      {
        "d": "W10",
        "v": 2.0
      },
      {
        "d": "W11",
        "v": 2.0
      },
      {
        "d": "W12",
        "v": 2.0
      }
    ]
  },
  {
    "id": 29,
    "name": "No of External communication",
    "unit": " Nos",
    "target": 150.0,
    "direction": "higher",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Digital Marketing",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 30,
    "name": "Bus branding",
    "unit": " Nos",
    "target": 0.0,
    "direction": "higher",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Digital Marketing",
    "history": [
      {
        "d": "W1",
        "v": 1.0
      },
      {
        "d": "W2",
        "v": 1.0
      },
      {
        "d": "W3",
        "v": 1.0
      },
      {
        "d": "W4",
        "v": 1.0
      }
    ]
  },
  {
    "id": 31,
    "name": "Internal event nos + Exhibition event (can be 1 anything happen)",
    "unit": " Nos",
    "target": 10.0,
    "direction": "higher",
    "team": "EXPO AND EVENTS",
    "owner": "Anitha",
    "kra": "Expo",
    "history": [
      {
        "d": "W1",
        "v": 2.0
      }
    ]
  },
  {
    "id": 32,
    "name": "No of new catalogs done - Domestic",
    "unit": " Nos",
    "target": 15.0,
    "direction": "higher",
    "team": "Graphic Designing",
    "owner": "Sandeep",
    "kra": "Graphic Design",
    "history": [
      {
        "d": "W1",
        "v": 1.0
      },
      {
        "d": "W2",
        "v": 1.0
      },
      {
        "d": "W3",
        "v": 1.0
      },
      {
        "d": "W4",
        "v": 1.0
      },
      {
        "d": "W5",
        "v": 1.0
      },
      {
        "d": "W6",
        "v": 1.0
      },
      {
        "d": "W7",
        "v": 1.0
      },
      {
        "d": "W8",
        "v": 1.0
      },
      {
        "d": "W9",
        "v": 1.0
      },
      {
        "d": "W10",
        "v": 2.0
      },
      {
        "d": "W11",
        "v": 2.0
      },
      {
        "d": "W12",
        "v": 2.0
      }
    ]
  },
  {
    "id": 33,
    "name": "No of new catalogs done - IB",
    "unit": " Nos",
    "target": 10.0,
    "direction": "higher",
    "team": "Graphic Designing",
    "owner": "Sandeep",
    "kra": "Graphic Design",
    "history": [
      {
        "d": "W1",
        "v": 1.0
      },
      {
        "d": "W2",
        "v": 1.0
      },
      {
        "d": "W3",
        "v": 1.0
      },
      {
        "d": "W4",
        "v": 1.0
      },
      {
        "d": "W5",
        "v": 1.0
      },
      {
        "d": "W6",
        "v": 1.0
      },
      {
        "d": "W7",
        "v": 1.0
      },
      {
        "d": "W8",
        "v": 1.0
      },
      {
        "d": "W9",
        "v": 1.0
      },
      {
        "d": "W10",
        "v": 1.0
      },
      {
        "d": "W11",
        "v": 1.0
      },
      {
        "d": "W12",
        "v": 1.0
      }
    ]
  },
  {
    "id": 34,
    "name": "No of catalogs improvements done - Domestic",
    "unit": " Nos",
    "target": 50.0,
    "direction": "higher",
    "team": "Graphic Designing",
    "owner": "Sandeep",
    "kra": "Graphic Design",
    "history": [
      {
        "d": "W1",
        "v": 3.0
      },
      {
        "d": "W2",
        "v": 3.0
      },
      {
        "d": "W3",
        "v": 3.0
      },
      {
        "d": "W4",
        "v": 5.0
      },
      {
        "d": "W5",
        "v": 5.0
      },
      {
        "d": "W6",
        "v": 5.0
      },
      {
        "d": "W7",
        "v": 5.0
      },
      {
        "d": "W8",
        "v": 5.0
      },
      {
        "d": "W9",
        "v": 5.0
      },
      {
        "d": "W10",
        "v": 5.0
      },
      {
        "d": "W11",
        "v": 5.0
      },
      {
        "d": "W12",
        "v": 5.0
      }
    ]
  },
  {
    "id": 35,
    "name": "No of catalogs improvements done- IB",
    "unit": " Nos",
    "target": 20.0,
    "direction": "higher",
    "team": "Graphic Designing",
    "owner": "Sandeep",
    "kra": "Graphic Design",
    "history": [
      {
        "d": "W1",
        "v": 1.0
      },
      {
        "d": "W2",
        "v": 1.0
      },
      {
        "d": "W3",
        "v": 1.0
      },
      {
        "d": "W4",
        "v": 1.0
      },
      {
        "d": "W5",
        "v": 1.0
      },
      {
        "d": "W6",
        "v": 2.0
      },
      {
        "d": "W7",
        "v": 2.0
      },
      {
        "d": "W8",
        "v": 2.0
      },
      {
        "d": "W9",
        "v": 2.0
      },
      {
        "d": "W10",
        "v": 3.0
      },
      {
        "d": "W11",
        "v": 3.0
      },
      {
        "d": "W12",
        "v": 3.0
      }
    ]
  },
  {
    "id": 36,
    "name": "Total marketing cost",
    "unit": " INR",
    "target": 0.0,
    "direction": "lower",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Digital Marketing",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 37,
    "name": "Domestic marketing cost",
    "unit": " INR",
    "target": 0,
    "direction": "higher",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Digital Marketing",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 38,
    "name": "IB marketing cost",
    "unit": " INR",
    "target": 0,
    "direction": "higher",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Digital Marketing",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 39,
    "name": "Call centre cost",
    "unit": " INR",
    "target": 24100000.0,
    "direction": "higher",
    "team": "Enquiry Management",
    "owner": "Malathi",
    "kra": "Enquiry Management",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 40,
    "name": "External agency cost",
    "unit": " INR",
    "target": 0,
    "direction": "higher",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Digital Marketing",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 41,
    "name": "Department cost for the month",
    "unit": " INR",
    "target": 0,
    "direction": "higher",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Digital Marketing",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 42,
    "name": "Expo",
    "unit": " INR",
    "target": 0,
    "direction": "higher",
    "team": "EXPO AND EVENTS",
    "owner": "Anitha",
    "kra": "Expo",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 43,
    "name": "Overall Marketing cost including field promotional cost",
    "unit": " INR",
    "target": 60100000.0,
    "direction": "higher",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Digital Marketing",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 44,
    "name": "CRM",
    "unit": " Nos",
    "target": 0.0,
    "direction": "higher",
    "team": "Enquiry Management",
    "owner": "Malathi",
    "kra": "Enquiry Management",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 45,
    "name": "No of improvement in CRM",
    "unit": " Nos",
    "target": 20.0,
    "direction": "higher",
    "team": "Enquiry Management",
    "owner": "Malathi",
    "kra": "Enquiry Management",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 46,
    "name": "Adherance to CRM /App",
    "unit": "%",
    "target": 1.0,
    "direction": "higher",
    "team": "Enquiry Management",
    "owner": "Malathi",
    "kra": "Enquiry Management",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 47,
    "name": "On time projects",
    "unit": "%",
    "target": 0.0,
    "direction": "higher",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Digital Marketing",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 48,
    "name": "No of Checklist for all activities - MDP (plan vs actual)",
    "unit": " Nos",
    "target": 0.0,
    "direction": "higher",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Digital Marketing",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 49,
    "name": "CC- dialer",
    "unit": " Time",
    "target": 0.0,
    "direction": "higher",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Digital Marketing",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 50,
    "name": "Mobile crm app",
    "unit": " Time",
    "target": 0.0,
    "direction": "higher",
    "team": "Enquiry Management",
    "owner": "Malathi",
    "kra": "Enquiry Management",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 51,
    "name": "All recording monitoring - CC+ Field",
    "unit": " Time",
    "target": 0.0,
    "direction": "higher",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Digital Marketing",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 52,
    "name": "Bring in all call as recording inside crm - TN",
    "unit": " Time",
    "target": 0.0,
    "direction": "higher",
    "team": "Enquiry Management",
    "owner": "Malathi",
    "kra": "Enquiry Management",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 53,
    "name": "Ontime Analysis / Strategy",
    "unit": "%",
    "target": 0.0,
    "direction": "higher",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Marketing Research",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 54,
    "name": "Region wise analysis - Enquiry distribution",
    "unit": " Nos",
    "target": 0.0,
    "direction": "higher",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Marketing Research",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 55,
    "name": "Region wise sales potential / marketing analysis",
    "unit": " Nos",
    "target": 0.0,
    "direction": "higher",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Marketing Research",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 56,
    "name": "Demo Machine clocking hour analysis",
    "unit": " Nos",
    "target": 0.0,
    "direction": "higher",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Marketing Research",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 57,
    "name": "Machine clocking hour analysis",
    "unit": " Nos",
    "target": 0.0,
    "direction": "higher",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Marketing Research",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 58,
    "name": "High/Low performing dealers + Market",
    "unit": " Nos",
    "target": 0.0,
    "direction": "higher",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Digital Marketing",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 59,
    "name": "First response lead time",
    "unit": " Nos",
    "target": 0.0,
    "direction": "higher",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Digital Marketing",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 60,
    "name": "TAT between Enquiry assigned time and field team",
    "unit": " Nos",
    "target": 0.0,
    "direction": "higher",
    "team": "Enquiry Management",
    "owner": "Malathi",
    "kra": "Enquiry Management",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 61,
    "name": "CRM geniunity from field",
    "unit": " Nos",
    "target": 0.0,
    "direction": "higher",
    "team": "Enquiry Management",
    "owner": "Malathi",
    "kra": "Enquiry Management",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 62,
    "name": "Good Place to work",
    "unit": " Nos",
    "target": 0.0,
    "direction": "higher",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Digital Marketing",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 63,
    "name": "BMS compliance",
    "unit": " Nos",
    "target": 0.0,
    "direction": "higher",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Digital Marketing",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 64,
    "name": "Subordinate score",
    "unit": " Nos",
    "target": 0.0,
    "direction": "higher",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Digital Marketing",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 65,
    "name": "Second level leader nurturing project",
    "unit": " Nos",
    "target": 0.0,
    "direction": "higher",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Digital Marketing",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 66,
    "name": "No of career growth plan given [1]",
    "unit": " Nos",
    "target": 0.0,
    "direction": "higher",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Digital Marketing",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 67,
    "name": "No of tranings given to subordinate",
    "unit": " Nos",
    "target": 0.0,
    "direction": "higher",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Digital Marketing",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  },
  {
    "id": 68,
    "name": "Calander adherance",
    "unit": "%",
    "target": 0.0,
    "direction": "higher",
    "team": "Digital Marketing",
    "owner": "Anand Kumar",
    "kra": "Digital Marketing",
    "history": [
      {
        "d": "W1",
        "v": 0
      }
    ]
  }
];

const teamsData = [
  { id: 1, name: "Digital Marketing", description: "Building brand visibility, engagement and cost-efficient leads across digital channels", lead: "Anand Kumar",
    members: [
      { id: 1, name: "Anand Kumar", employeeId: "EMP-1042", designation: "Digital Marketing Junior Manager", experience: 5, reportingManager: "CMO", description: "Leads overall digital campaigns and strategy." },
      { id: 2, name: "Krithika", employeeId: "EMP-1058", designation: "Intern - Digital Marketing", experience: 1, reportingManager: "Anand Kumar", description: "Assists with social content and digital updates." },
    ] },
  { id: 2, name: "Video Production", description: "Producing on-brand video content on schedule", lead: "Jefrin",
    members: [
      { id: 3, name: "Jefrin", employeeId: "EMP-1071", designation: "Video Production Lead", experience: 6, reportingManager: "Marketing Head", description: "Manages video content development and scheduling." },
      { id: 4, name: "Harish", employeeId: "EMP-1072", designation: "Video Editor", experience: 3, reportingManager: "Jefrin", description: "Subordinate of Jefrin." },
      { id: 5, name: "Sanjay", employeeId: "EMP-1073", designation: "Videographer", experience: 3, reportingManager: "Jefrin", description: "Subordinate of Jefrin." },
      { id: 6, name: "Anand", employeeId: "EMP-1074", designation: "Video Assistant", experience: 2, reportingManager: "Jefrin", description: "Subordinate of Jefrin." },
      { id: 7, name: "Shivangi", employeeId: "EMP-1075", designation: "Script Writer", experience: 2, reportingManager: "Jefrin", description: "Subordinate of Jefrin." },
    ] },
  { id: 3, name: "Graphic Designing", description: "Delivering design assets for campaigns and collateral", lead: "Sandeep",
    members: [
      { id: 8, name: "Sandeep", employeeId: "EMP-1083", designation: "Graphic Design Lead", experience: 6, reportingManager: "Marketing Head", description: "Oversees print and digital design requests." },
      { id: 9, name: "Gopi", employeeId: "EMP-1084", designation: "Graphic Designer", experience: 3, reportingManager: "Sandeep", description: "Subordinate of Sandeep for domestic and international." },
      { id: 10, name: "Kalaivani", employeeId: "EMP-1085", designation: "Graphic Designer", experience: 3, reportingManager: "Sandeep", description: "Subordinate of Sandeep for domestic and international." },
      { id: 11, name: "Nowshand", employeeId: "EMP-1086", designation: "Graphic Designer - IB", experience: 4, reportingManager: "Sandeep", description: "Subordinate of Sandeep dedicated for the IB." },
    ] },
  { id: 4, name: "Enquiry Management", description: "Managing inbound enquiries and converting them into qualified leads", lead: "Malathi",
    members: [
      { id: 12, name: "Malathi", employeeId: "EMP-1094", designation: "Enquiry Desk Lead", experience: 7, reportingManager: "Marketing Head", description: "Oversees enquiry intake and conversion tracking." },
      { id: 13, name: "Saranya", employeeId: "EMP-1095", designation: "Enquiry Agent", experience: 3, reportingManager: "Malathi", description: "Agent working under Malathi." },
      { id: 14, name: "Shalini", employeeId: "EMP-1096", designation: "Enquiry Agent", experience: 3, reportingManager: "Malathi", description: "Agent working under Malathi." },
      { id: 15, name: "Smeronika", employeeId: "EMP-1097", designation: "Enquiry Agent", experience: 2, reportingManager: "Malathi", description: "Agent working under Malathi." },
      { id: 16, name: "Jennet", employeeId: "EMP-1098", designation: "Enquiry Agent", experience: 2, reportingManager: "Malathi", description: "Agent working under Malathi." },
      { id: 17, name: "Agent 1", employeeId: "EMP-1099", designation: "Enquiry Agent 1", experience: 1, reportingManager: "Malathi", description: "Agent 1 working under Malathi." },
      { id: 18, name: "Agent 2", employeeId: "EMP-1100", designation: "Enquiry Agent 2", experience: 1, reportingManager: "Malathi", description: "Agent 2 working under Malathi." },
      { id: 19, name: "Agent 3", employeeId: "EMP-1101", designation: "Enquiry Agent 3", experience: 1, reportingManager: "Malathi", description: "Agent 3 working under Malathi." },
      { id: 20, name: "Agent 4", employeeId: "EMP-1102", designation: "Enquiry Agent 4", experience: 1, reportingManager: "Malathi", description: "Agent 4 working under Malathi." },
      { id: 21, name: "Agent 5", employeeId: "EMP-1103", designation: "Enquiry Agent 5", experience: 1, reportingManager: "Malathi", description: "Agent 5 working under Malathi." },
      { id: 22, name: "Agent 6", employeeId: "EMP-1104", designation: "Enquiry Agent 6", experience: 1, reportingManager: "Malathi", description: "Agent 6 working under Malathi." },
    ] },
  { id: 5, name: "CRM and Coordinator", description: "Customer relationship management and coordination", lead: "Keerthana",
    members: [
      { id: 23, name: "Keerthana", employeeId: "EMP-1119", designation: "CRM Lead & Coordinator", experience: 5, reportingManager: "Marketing Head", description: "Leads client relationships and service coordination." },
    ] },
  { id: 6, name: "EXPO AND EVENTS", description: "Generating and capturing leads at trade shows and exhibitions", lead: "Anitha",
    members: [
      { id: 24, name: "Anitha", employeeId: "EMP-1105", designation: "Events & Expo Lead", experience: 5, reportingManager: "Marketing Head", description: "Plans and executes expo participation end-to-end." },
    ] },
]; */

const okrsData = [
  { id: 1, objective: "Grow digital presence this quarter", level: "Company", owner: "Digital Marketing", keyResults: [
    { id: 1, name: "Grow website traffic to 50,000 sessions/month", linkedKpiId: 1 },
    { id: 2, name: "Lift social engagement rate to 4.5%", linkedKpiId: 2 },
  ]},
  { id: 2, objective: "Convert more enquiries into qualified leads", level: "Team", owner: "Enquiry Management", keyResults: [
    { id: 3, name: "Cut enquiry response time to 4 hrs", linkedKpiId: 6 },
    { id: 4, name: "Raise enquiry-to-lead conversion to 30%", linkedKpiId: 7 },
  ]},
];

const initialProjects = []; /*
  {
    id: 1,
    title: "Video Content Hub Relaunch",
    resultAndImprovement: "Produce 10 key internal training videos and increase view reach by 20%.",
    linkedKpiId: 23,
    leadName: "Rohan Das",
    memberNames: ["Rohan Das", "Aman Verma"],
    targetDate: "2026-10-15",
    currentStageIdx: 1,
    stages: [
      { name: "Scripting & Storyboards", targetDate: "2026-08-20", status: "completed" },
      { name: "Filming & Production", targetDate: "2026-09-15", status: "current" },
      { name: "Post-Editing & Reviews", targetDate: "2026-10-01", status: "pending" },
      { name: "Final Deployment", targetDate: "2026-10-15", status: "pending" }
    ]
  },
  {
    id: 2,
    title: "V4 Website SEO Optimization",
    resultAndImprovement: "Improve Google search indexing rankings and boost monthly traffic to 150k sessions.",
    linkedKpiId: 29,
    leadName: "Pooja Mehta",
    memberNames: ["Pooja Mehta", "Karthik Menon"],
    targetDate: "2026-12-01",
    currentStageIdx: 0,
    stages: [
      { name: "Audit & Keyword Research", targetDate: "2026-09-01", status: "current" },
      { name: "On-Page Optimization", targetDate: "2026-10-15", status: "pending" },
      { name: "Backlink Campaign", targetDate: "2026-11-15", status: "pending" },
      { name: "Final Performance Audit", targetDate: "2026-12-01", status: "pending" }
    ]
  }
]; */

const campaignsData = [
  { id: 1, name: "Autumn Trade Expo 2026", start: "Sep 10", end: "Sep 14", owner: "Meera Kapoor", linkedKpiIds: [8, 3] },
  { id: 2, name: "Website Relaunch Push", start: "Aug 1", end: "Sep 30", owner: "Aditi Rao", linkedKpiIds: [1, 2] },
];

/* ---------------- Status logic (shared) ---------------- */

function getLatest(kpi) { return kpi.history[kpi.history.length - 1].v; }

function getStatus(kpi) {
  const latest = getLatest(kpi);
  if (kpi.direction === "higher") {
    const ratio = kpi.target === 0 ? 1 : latest / kpi.target;
    if (ratio >= 1) return "on-track";
    if (ratio >= 0.92) return "at-risk";
    return "off-track";
  } else {
    if (latest <= kpi.target) return "on-track";
    if (latest <= kpi.target * 1.2) return "at-risk";
    return "off-track";
  }
}

function progressPct(kpi) {
  const latest = getLatest(kpi);
  if (kpi.direction === "higher") return Math.min(100, Math.round((latest / kpi.target) * 100));
  if (latest === 0 && kpi.target === 0) return 100;
  return Math.min(100, Math.round((kpi.target / Math.max(latest, 0.0001)) * 100));
}

const STATUS_STYLES = {
  "on-track": { bg: "bg-teal-50", text: "text-teal-700", dot: "text-teal-500", label: "On track" },
  "at-risk": { bg: "bg-orange-50", text: "text-orange-700", dot: "text-orange-500", label: "At risk" },
  "off-track": { bg: "bg-rose-50", text: "text-rose-700", dot: "text-rose-500", label: "Off track" },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${s.bg} ${s.text}`}>
      <Circle className={`h-1.5 w-1.5 fill-current ${s.dot}`} />
      {s.label}
    </span>
  );
}

/* ---------------- Log value modal (shared) ---------------- */

function LogValueModal({ kpi, onClose, onSubmit }) {
  const [value, setValue] = useState(getLatest(kpi));
  return (
    <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-5 w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900" style={{ fontFamily: "Poppins, sans-serif" }}>Log {kpi.name}</h3>
          <button onClick={onClose} className="text-slate-400"><X className="h-4 w-4" /></button>
        </div>
        <p className="text-xs text-slate-400 mb-1">Target: {kpi.target}{kpi.unit}</p>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="flex-1 border border-orange-200 rounded-xl px-3 py-2.5 text-lg font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-300"
          />
          <span className="text-slate-400 text-sm">{kpi.unit}</span>
        </div>
        <button
          onClick={() => { onSubmit(kpi.id, parseFloat(value)); onClose(); }}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-2.5 rounded-xl transition-colors"
        >
          Save entry
        </button>
      </div>
    </div>
  );
}

/* ---------------- KPI detail drawer (shared) ---------------- */

function KpiDetail({ kpi, onClose, onLog }) {
  const status = getStatus(kpi);
  return (
    <div className="fixed inset-0 bg-slate-900/40 flex items-end md:items-center justify-center z-50 p-0 md:p-4">
      <div className="bg-white rounded-t-2xl md:rounded-2xl p-5 w-full max-w-lg max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold text-slate-900" style={{ fontFamily: "Poppins, sans-serif" }}>{kpi.name}</h3>
          <button onClick={onClose} className="text-slate-400"><X className="h-4 w-4" /></button>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <StatusBadge status={status} />
          <span className="text-xs text-slate-400">
            {kpi.team} · {kpi.owner}
            {(() => {
              const allMembers = teamsData.flatMap(t => t.members);
              const member = allMembers.find(m => m.name === kpi.owner);
              return member && member.reportingManager ? ` (Reporting to: ${member.reportingManager})` : "";
            })()}
          </span>
        </div>
        <div className="flex items-end gap-4 mb-4">
          <div>
            <p className="text-2xl font-semibold text-slate-900">{getLatest(kpi)}{kpi.unit}</p>
            <p className="text-xs text-slate-400">Current actual</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-slate-400">{kpi.target}{kpi.unit}</p>
            <p className="text-xs text-slate-400">Target</p>
          </div>
        </div>
        <div className="h-40 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={kpi.history} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#fdf1e8" vertical={false} />
              <XAxis dataKey="d" tick={{ fontSize: 11, fill: "#c4917a" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#c4917a" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #fde3d3" }} />
              <Line type="monotone" dataKey="v" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {kpi.targetsList && kpi.targetsList.length > 0 && (
          <div className="mb-4 pt-3 border-t border-orange-50">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Target Schedule ({kpi.targetType || "monthly"})
            </p>
            <div className="space-y-1.5 max-h-32 overflow-y-auto bg-orange-50/20 p-2.5 rounded-xl border border-orange-100/40">
              {kpi.targetsList.map(t => (
                <div key={t.id} className="flex justify-between text-xs py-1 px-1.5 bg-white rounded border border-orange-100/30">
                  <span className="font-semibold text-slate-600">{t.label}</span>
                  <span className="text-slate-500">
                    <strong className="text-slate-800">{t.targetValue}</strong>{kpi.unit} by {t.targetDate}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onLog}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-2.5 rounded-xl transition-colors"
        >
          Log new value
        </button>
      </div>
    </div>
  );
}

/* ---------------- Add member / Add vertical modals (shared) ---------------- */

/* ---------------- Add KPI modal (shared) ---------------- */



function AddPlayerModal({ teams, defaultTeamId, onClose, onSubmit }) {
  const [teamId, setTeamId] = useState(defaultTeamId || teams[0]?.id);
  const [form, setForm] = useState({ name: "", designation: "", experience: "", description: "" });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-5 w-full max-w-md max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900" style={{ fontFamily: "Poppins, sans-serif" }}>Add Player</h3>
          <button onClick={onClose} className="text-slate-400"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">User (Name)</label>
            <input value={form.name} onChange={set("name")} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300" placeholder="e.g. Neha Kulkarni" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Designation</label>
              <input value={form.designation} onChange={set("designation")} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300" placeholder="e.g. Content Executive" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Years of Experience</label>
              <input type="number" value={form.experience} onChange={set("experience")} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300" placeholder="3" />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Description</label>
            <textarea value={form.description} onChange={set("description")} rows={2} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300" placeholder="What does this person own?" />
          </div>
        </div>
        <button
          onClick={() => { if (!form.name) return; onSubmit(teamId, { ...form, id: Date.now(), employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`, experience: parseFloat(form.experience) || 0 }); onClose(); }}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-2.5 rounded-xl transition-colors mt-4"
        >
          Add Player
        </button>
      </div>
    </div>
  );
}

function AddTeamModal({ teams, onClose, onSubmit }) {
  const [form, setForm] = useState({ title: "", description: "", lead: "" });
  const [showCustomLead, setShowCustomLead] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const allEmployees = teams.flatMap((t) => t.members.map((m) => ({ ...m, team: t.name })));
  const canSubmit = form.title.trim() && form.lead;

  return (
    <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-5 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900" style={{ fontFamily: "Poppins, sans-serif" }}>Add Team</h3>
          <button onClick={onClose} className="text-slate-400"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Title</label>
            <input value={form.title} onChange={set("title")} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300" placeholder="e.g. Brand Partnerships" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Description</label>
            <textarea value={form.description} onChange={set("description")} rows={2} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300" placeholder="What does this team cover?" />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs text-slate-500 block">Team Lead <span className="text-rose-500">*</span></label>
              <button 
                type="button" 
                onClick={() => {
                  setShowCustomLead(!showCustomLead);
                  setForm({ ...form, lead: "" });
                }}
                className="text-[10px] text-teal-600 hover:text-teal-700 font-bold hover:underline"
              >
                {showCustomLead ? "Select Existing Lead" : "+ Add New Lead Name"}
              </button>
            </div>
            {showCustomLead ? (
              <input 
                value={form.lead} 
                onChange={set("lead")} 
                className="w-full border border-orange-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300" 
                placeholder="Enter lead name..." 
              />
            ) : (
              <select value={form.lead} onChange={set("lead")} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-300">
                <option value="">Select a lead...</option>
                {allEmployees.map((m) => <option key={m.id} value={m.name}>{m.name} · {m.designation} ({m.team})</option>)}
              </select>
            )}
          </div>
        </div>
        <button
          disabled={!canSubmit}
          onClick={() => { onSubmit({ id: Date.now(), name: form.title, description: form.description, lead: form.lead, members: [] }); onClose(); }}
          className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-slate-200 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-xl transition-colors mt-4"
        >
          Add Team
        </button>
      </div>
    </div>
  );
}

function AddProjectModal({ teams, kpis, project, onClose, onSubmit }) {
  const [title, setTitle] = useState(project?.title || "");
  const [resultAndImprovement, setResultAndImprovement] = useState(project?.resultAndImprovement || "");
  const [linkedKpiIds, setLinkedKpiIds] = useState(project?.linkedKpiIds || (project?.linkedKpiId ? [project.linkedKpiId] : []));
  const [leadName, setLeadName] = useState(project?.leadName || "");
  const [memberNames, setMemberNames] = useState(project?.memberNames || []);
  const [targetDate, setTargetDate] = useState(project?.targetDate || "");
  const [kpiSearch, setKpiSearch] = useState("");
  
  const initStages = (src) => src.map((s, i) => ({ ...s, _id: s._id || (Date.now() + i) }));
  const [stages, setStages] = useState(() => initStages(project?.stages || [
    { name: "Planning", targetDate: "", status: "current" },
    { name: "Execution", targetDate: "", status: "pending" },
    { name: "Review", targetDate: "", status: "pending" },
    { name: "Launch", targetDate: "", status: "pending" }
  ]));
  const [swappingIdx, setSwappingIdx] = useState(null);
  const [swappingDir, setSwappingDir] = useState(null);

  const allEmployees = teams.flatMap((t) => t.members);
  const selectedLeadTeam = teams.find((t) => t.members.some((m) => m.name === leadName));
  const memberOptions = selectedLeadTeam ? selectedLeadTeam.members : allEmployees;

  const handleStageChange = (idx, field, value) => {
    setStages(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  const handleMemberToggle = (name) => {
    setMemberNames(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  };

  const addStage = () => {
    setStages(prev => [...prev, { name: "", targetDate: "", status: "pending", _id: Date.now() }]);
  };

  const removeStage = (idx) => {
    if (stages.length <= 1) return;
    setStages(prev => prev.filter((_, i) => i !== idx));
  };

  const moveStageUp = (idx) => {
    if (idx === 0 || swappingIdx !== null) return;
    setSwappingIdx(idx);
    setSwappingDir("up");
    setTimeout(() => {
      setStages(prev => {
        const nextS = [...prev];
        const temp = nextS[idx];
        nextS[idx] = nextS[idx - 1];
        nextS[idx - 1] = temp;
        return nextS;
      });
      setSwappingIdx(null);
      setSwappingDir(null);
    }, 250);
  };

  const moveStageDown = (idx) => {
    if (idx === stages.length - 1 || swappingIdx !== null) return;
    setSwappingIdx(idx);
    setSwappingDir("down");
    setTimeout(() => {
      setStages(prev => {
        const nextS = [...prev];
        const temp = nextS[idx];
        nextS[idx] = nextS[idx + 1];
        nextS[idx + 1] = temp;
        return nextS;
      });
      setSwappingIdx(null);
      setSwappingDir(null);
    }, 250);
  };

  const canSubmit = title.trim() && leadName && targetDate && stages.every(s => s.name.trim() && s.targetDate);

  return (
    <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-5 w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900 text-base" style={{ fontFamily: "Poppins, sans-serif" }}>{project ? "Edit Project" : "Add Project"}</h3>
          <button onClick={onClose} className="text-slate-400"><X className="h-4 w-4" /></button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Project Title *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300" placeholder="e.g. CRM Integration Upgrade" />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Expected Results & Improvements</label>
            <textarea value={resultAndImprovement} onChange={(e) => setResultAndImprovement(e.target.value)} rows={2} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300" placeholder="Describe the business outcomes..." />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Project Lead *</label>
              <select value={leadName} onChange={(e) => { setLeadName(e.target.value); setMemberNames([]); }} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-300">
                <option value="">Select a lead...</option>
                {allEmployees.map(m => <option key={m.id} value={m.name}>{m.name} · {m.designation}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Project Target Date *</label>
              <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Connected KPIs (Select 1 or more)</label>
            <input 
              type="text" 
              value={kpiSearch} 
              onChange={(e) => setKpiSearch(e.target.value)} 
              placeholder="Search KPIs by name..." 
              className="w-full border border-orange-200 rounded-xl px-3 py-1.5 text-xs mb-2 focus:outline-none focus:ring-2 focus:ring-teal-300 bg-white"
            />
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto border border-orange-100 p-2 rounded-xl bg-orange-50/35">
              {kpis.filter(k => k.name.toLowerCase().includes(kpiSearch.toLowerCase())).map(k => {
                const selected = linkedKpiIds.includes(k.id);
                return (
                  <button
                    key={k.id}
                    type="button"
                    onClick={() => {
                      setLinkedKpiIds(prev => prev.includes(k.id) ? prev.filter(id => id !== k.id) : [...prev, k.id]);
                    }}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-all text-left ${
                      selected ? "bg-teal-500 border-teal-500 text-white" : "bg-white border-orange-100 text-slate-600 hover:bg-orange-50"
                    }`}
                  >
                    {k.name}
                  </button>
                );
              })}
              {kpis.filter(k => k.name.toLowerCase().includes(kpiSearch.toLowerCase())).length === 0 && (
                <span className="text-xs text-slate-400 italic p-1">No matching KPIs found</span>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Select Team Members</label>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto border border-orange-100 p-2 rounded-xl bg-orange-50/35">
              {memberOptions.map(m => {
                const selected = memberNames.includes(m.name);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleMemberToggle(m.name)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                      selected ? "bg-teal-500 border-teal-500 text-white" : "bg-white border-orange-100 text-slate-600 hover:bg-orange-50"
                    }`}
                  >
                    {m.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-500 block">Project Stages & Target Dates *</label>
              <button
                type="button"
                onClick={addStage}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
              >
                <Plus className="h-3 w-3" /> Add Stage
              </button>
            </div>
            <div className="space-y-2">
              {stages.map((stage, idx) => {
                const isSwappingActive = swappingIdx === idx;
                const isSwappingTarget = swappingIdx !== null && (
                  swappingDir === "up" ? swappingIdx - 1 === idx : swappingIdx + 1 === idx
                );

                let translateY = 0;
                if (isSwappingActive) {
                  translateY = swappingDir === "up" ? -54 : 54;
                } else if (isSwappingTarget) {
                  translateY = swappingDir === "up" ? 54 : -54;
                }

                const rowStyle = {
                  transition: swappingIdx !== null ? "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s" : "none",
                  transform: translateY ? `translateY(${translateY}px)` : "none",
                  opacity: isSwappingActive ? 0.8 : 1,
                  position: "relative",
                  zIndex: isSwappingActive || isSwappingTarget ? 10 : 1,
                };
                return (
                <div 
                  key={stage._id} 
                  style={rowStyle} 
                  className={`flex gap-2 items-center bg-orange-50/50 p-2.5 rounded-xl border transition-all ${
                    isSwappingActive 
                      ? "shadow-md border-orange-300 bg-orange-100/20 scale-[1.01]" 
                      : "border-orange-100/50"
                  }`}
                >
                  <span className="text-xs font-bold text-orange-700 w-5">{idx + 1}.</span>
                  <div className="flex flex-col gap-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveStageUp(idx)}
                      className="text-slate-400 hover:text-slate-650 disabled:opacity-20 disabled:cursor-not-allowed"
                      title="Move Up"
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === stages.length - 1}
                      onClick={() => moveStageDown(idx)}
                      className="text-slate-400 hover:text-slate-650 disabled:opacity-20 disabled:cursor-not-allowed -mt-1"
                      title="Move Down"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <input
                    value={stage.name}
                    onChange={(e) => handleStageChange(idx, "name", e.target.value)}
                    className="flex-1 border border-orange-200 rounded-lg px-2 py-1 text-xs focus:outline-none bg-white"
                    placeholder="Stage Name"
                  />
                  <input
                    type="date"
                    value={stage.targetDate}
                    onChange={(e) => handleStageChange(idx, "targetDate", e.target.value)}
                    className="border border-orange-200 rounded-lg px-2 py-1 text-xs focus:outline-none bg-white w-32"
                  />
                  {stages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStage(idx)}
                      className="text-rose-500 hover:text-rose-600 p-1"
                      title="Remove Stage"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              );
          })}
            </div>
          </div>
        </div>

        <button
          disabled={!canSubmit}
          onClick={() => {
            onSubmit({
              id: project ? project.id : `temp-${Date.now()}`,
              title,
              resultAndImprovement,
              linkedKpiIds,
              leadName,
              memberNames: memberNames.length > 0 ? memberNames : [leadName],
              targetDate,
              currentStageIdx: project ? project.currentStageIdx : 0,
              stages
            });
            onClose();
          }}
          className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-slate-200 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-xl transition-colors mt-5"
        >
          {project ? "Update Project" : "Create Project"}
        </button>
      </div>
    </div>
  );
}

const FY_MONTHS = [
  { name: "Apr", year: 2026, monthIdx: 3 },
  { name: "May", year: 2026, monthIdx: 4 },
  { name: "Jun", year: 2026, monthIdx: 5 },
  { name: "Jul", year: 2026, monthIdx: 6 },
  { name: "Aug", year: 2026, monthIdx: 7 },
  { name: "Sep", year: 2026, monthIdx: 8 },
  { name: "Oct", year: 2026, monthIdx: 9 },
  { name: "Nov", year: 2026, monthIdx: 10 },
  { name: "Dec", year: 2026, monthIdx: 11 },
  { name: "Jan", year: 2027, monthIdx: 0 },
  { name: "Feb", year: 2027, monthIdx: 1 },
  { name: "Mar", year: 2027, monthIdx: 2 }
];

const HOLIDAYS = [
  "2026-04-03", // Good Friday
  "2026-05-01", // May Day
  "2026-08-15", // Independence Day
  "2026-10-02", // Gandhi Jayanti
  "2026-11-08", // Diwali
  "2026-12-25", // Christmas
  "2027-01-26"  // Republic Day
];

const isWeekendDay = (dateStr) => {
  const d = new Date(dateStr);
  const day = d.getDay();
  if (day === 0) return { isHoliday: true, name: "Sunday" };
  if (day === 6) return { isHoliday: true, name: "Saturday" };
  return { isHoliday: false };
};

const getDaysInMonth = (monthName) => {
  const monthInfo = FY_MONTHS.find(m => m.name === monthName);
  if (!monthInfo) return [];
  const date = new Date(monthInfo.year, monthInfo.monthIdx, 1);
  const days = [];
  while (date.getMonth() === monthInfo.monthIdx) {
    const year = date.getFullYear();
    const mIdx = String(date.getMonth() + 1).padStart(2, "0");
    const dIdx = String(date.getDate()).padStart(2, "0");
    days.push(`${year}-${mIdx}-${dIdx}`);
    date.setDate(date.getDate() + 1);
  }
  return days;
};

const getCalendarCells = (monthName) => {
  const monthInfo = FY_MONTHS.find(m => m.name === monthName);
  if (!monthInfo) return [];
  const firstDay = new Date(monthInfo.year, monthInfo.monthIdx, 1).getDay(); // 0 to 6
  const days = getDaysInMonth(monthName);
  const cells = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push({ isEmpty: true });
  }
  days.forEach(dStr => {
    const dayNum = parseInt(dStr.split("-")[2]);
    cells.push({ isEmpty: false, dateStr: dStr, dayNum });
  });
  return cells;
};

const getDaysInWeekRow = (monthName, rowIdx) => {
  const cells = getCalendarCells(monthName);
  const rowCells = cells.slice(rowIdx * 7, (rowIdx + 1) * 7);
  return rowCells.filter(c => c && !c.isEmpty).map(c => c.dateStr);
};

const getFYearDays = () => {
  const days = [];
  FY_MONTHS.forEach(mInfo => {
    const date = new Date(mInfo.year, mInfo.monthIdx, 1);
    while (date.getMonth() === mInfo.monthIdx) {
      const year = date.getFullYear();
      const mStr = String(date.getMonth() + 1).padStart(2, "0");
      const dStr = String(date.getDate()).padStart(2, "0");
      days.push(`${year}-${mStr}-${dStr}`);
      date.setDate(date.getDate() + 1);
    }
  });
  return days;
};

const checkIsHolidayPure = (dateStr, holidaysEnabled, customHolidays) => {
  if (!holidaysEnabled) return { isHoliday: false };
  if (customHolidays?.[dateStr]) {
    return { isHoliday: true, name: "Admin Holiday" };
  }
  const d = new Date(dateStr);
  if (d.getDay() === 0) {
    return { isHoliday: true, name: "Sunday" };
  }
  return { isHoliday: false };
};

const distributeMonthToSubperiods = (monthName, monthVal, currentDaily, currentWeekly, holidaysEnabled, customHolidays) => {
  const cells = getCalendarCells(monthName);
  const numRows = Math.ceil(cells.length / 7);

  const baseWeek = Math.floor(monthVal / numRows);
  let remWeek = monthVal - (baseWeek * numRows);
  const nextW = { ...currentWeekly };
  for (let i = 1; i <= numRows; i++) {
    nextW[`${monthName}-Week${i}`] = baseWeek + (remWeek > 0 ? 1 : 0);
    if (remWeek > 0) remWeek--;
  }

  const nextD = { ...currentDaily };
  for (let r = 0; r < numRows; r++) {
    const wVal = nextW[`${monthName}-Week${r + 1}`] || 0;
    const weekDays = getDaysInWeekRow(monthName, r);
    const workingDays = weekDays.filter(d => !checkIsHolidayPure(d, holidaysEnabled, customHolidays).isHoliday);
    const wCount = workingDays.length || weekDays.length || 7;
    const baseDay = Math.floor(wVal / wCount);
    let remDay = wVal - (baseDay * wCount);

    weekDays.forEach(d => {
      const check = checkIsHolidayPure(d, holidaysEnabled, customHolidays);
      if (check.isHoliday) {
        nextD[d] = 0;
      } else {
        nextD[d] = baseDay + (remDay > 0 ? 1 : 0);
        if (remDay > 0) remDay--;
      }
    });
  }

  return { nextW, nextD };
};

const distributeMonthActualToSubperiods = (monthName, monthVal, currentDailyAct, currentWeeklyAct, holidaysEnabled, customHolidays) => {
  const cells = getCalendarCells(monthName);
  const numRows = Math.ceil(cells.length / 7);

  const baseWeek = Math.floor(monthVal / numRows);
  let remWeek = monthVal - (baseWeek * numRows);
  const nextWAct = { ...currentWeeklyAct };
  for (let i = 1; i <= numRows; i++) {
    nextWAct[`${monthName}-Week${i}`] = baseWeek + (remWeek > 0 ? 1 : 0);
    if (remWeek > 0) remWeek--;
  }

  const nextDAct = { ...currentDailyAct };
  for (let r = 0; r < numRows; r++) {
    const wVal = nextWAct[`${monthName}-Week${r + 1}`] || 0;
    const weekDays = getDaysInWeekRow(monthName, r);
    const workingDays = weekDays.filter(d => !checkIsHolidayPure(d, holidaysEnabled, customHolidays).isHoliday);
    const wCount = workingDays.length || weekDays.length || 7;
    const baseDay = Math.floor(wVal / wCount);
    let remDay = wVal - (baseDay * wCount);

    weekDays.forEach(d => {
      const check = checkIsHolidayPure(d, holidaysEnabled, customHolidays);
      if (check.isHoliday) {
        nextDAct[d] = 0;
      } else {
        nextDAct[d] = baseDay + (remDay > 0 ? 1 : 0);
        if (remDay > 0) remDay--;
      }
    });
  }

  return { nextWAct, nextDAct };
};

function isHolidayOrWeekend(dateStr) {
  if (HOLIDAYS.includes(dateStr)) return { isHoliday: true, name: "Holiday" };
  const d = new Date(dateStr);
  const day = d.getDay();
  if (day === 0) return { isHoliday: true, name: "Sunday" };
  if (day === 6) return { isHoliday: true, name: "Saturday" };
  return { isHoliday: false };
}

const formatIndianNumber = (num) => {
  if (num === null || num === undefined || isNaN(num) || num === 0) return "";
  return Number(num).toLocaleString('en-IN');
};

const parseIndianNumber = (str) => {
  if (!str) return 0;
  const cleanStr = String(str).replace(/,/g, '');
  return Math.round(parseFloat(cleanStr) || 0);
};

function EditKpiModal({ kpi, teams, onClose, onSubmit, onAddVertical, onAddMember, sidebarMinimized }) {
  // Drive, Monitor, DO (owner) and Weightage configurations
  const [driveBy, setDriveBy] = useState(kpi.driveBy || "");
  const [monitorBy, setMonitorBy] = useState(kpi.monitorBy || "");
  const [weightage, setWeightage] = useState(kpi.weightage || 0);
  const [name, setName] = useState(kpi.name);
  const [description, setDescription] = useState(kpi.description || "");
  const [unit, setUnit] = useState(kpi.unit);
  const isTimeKpi = unit.trim().toLowerCase() === "time";
  const [distributeEnabled, setDistributeEnabled] = useState(kpi.targetType !== "monthly");
  
  // Inline creation states for team/member
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberDesignation, setNewMemberDesignation] = useState("Team Member");

  const [direction, setDirection] = useState(kpi.direction);
  const [team, setTeam] = useState(kpi.team);
  const [owner, setOwner] = useState(kpi.owner);

  // Advanced targeting configuration
  const [totalTargetInput, setTotalTargetInput] = useState(kpi.target || 0);
  const [selectedMonth, setSelectedMonth] = useState("Apr");

  // Holiday & Leave States
  const [holidaysEnabled, setHolidaysEnabled] = useState(kpi.holidaysEnabled ?? true);
  const [customHolidays, setCustomHolidays] = useState(kpi.customHolidays || {});
  
  const [dailyLeave] = useState({});
  const [dailyPartialLeave] = useState({});

  // Monthly Allocation state
  const [monthlyAlloc, setMonthlyAlloc] = useState(() => {
    const defaultM = {};
    ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"].forEach(m => {
      defaultM[m] = kpi.monthlyAlloc?.[m] ?? Math.round(((kpi.target || 0) / 12) * 100) / 100;
    });
    return defaultM;
  });

  // Achievement (Actual) states
  const [monthlyActual, setMonthlyActual] = useState(() => {
    const defaultM = {};
    ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"].forEach(m => {
      defaultM[m] = kpi.monthlyActual?.[m] ?? 0;
    });
    return defaultM;
  });

  // Daily Allocation state
  const [dailyAlloc, setDailyAlloc] = useState(kpi.dailyAlloc || {});
  const [dailyActual, setDailyActual] = useState(kpi.dailyActual || {});

  // Revised target allocation state
  const [revisedAlloc, setRevisedAlloc] = useState(kpi.revisedAlloc || {});

  // Weekly Allocation state
  const [weeklyAlloc, setWeeklyAlloc] = useState(kpi.weeklyAlloc || {});
  const [weeklyActual, setWeeklyActual] = useState(kpi.weeklyActual || {});

  const selectedTeamObj = teams.find(t => t.name === team);
  const allMembers = teams.flatMap(t => t.members);
  const ownerOptions = allMembers.filter((m, i, arr) => arr.findIndex(x => x.name === m.name) === i);

  // Helper check holiday
  const checkIsHoliday = (dateStr) => {
    if (!holidaysEnabled) return { isHoliday: false };
    
    // Admin custom holidays
    if (customHolidays[dateStr]) {
      return { isHoliday: true, name: "Admin Holiday" };
    }

    // Default Sunday is a holiday
    const d = new Date(dateStr);
    if (d.getDay() === 0) {
      return { isHoliday: true, name: "Sunday" };
    }
    
    return { isHoliday: false };
  };

  const handleAutoAssign = () => {
    const totalVal = Math.round(parseFloat(totalTargetInput) || 0);
    const base = Math.floor(totalVal / 12);
    let remainder = totalVal - (base * 12);

    const nextM = {};
    let nextW = { ...weeklyAlloc };
    let nextD = { ...dailyAlloc };

    ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"].forEach(m => {
      const monthVal = base + (remainder > 0 ? 1 : 0);
      if (remainder > 0) remainder--;
      nextM[m] = monthVal;

      const subRes = distributeMonthToSubperiods(m, monthVal, nextD, nextW, holidaysEnabled, customHolidays);
      nextW = subRes.nextW;
      nextD = subRes.nextD;
    });

    setMonthlyAlloc(nextM);
    setWeeklyAlloc(nextW);
    setDailyAlloc(nextD);
  };

  const handleMonthlyChange = (monthName, val) => {
    const numVal = Math.round(parseFloat(val) || 0);
    setMonthlyAlloc(prev => {
      const nextM = { ...prev, [monthName]: numVal };
      const totalSum = Object.values(nextM).reduce((a, b) => a + b, 0);
      setTotalTargetInput(totalSum);

      const subRes = distributeMonthToSubperiods(monthName, numVal, dailyAlloc, weeklyAlloc, holidaysEnabled, customHolidays);
      setWeeklyAlloc(subRes.nextW);
      setDailyAlloc(subRes.nextD);

      return nextM;
    });
  };

  const handleMonthlyActualChange = (monthName, val) => {
    const numVal = Math.round(parseFloat(val) || 0);
    setMonthlyActual(prev => {
      const nextM = { ...prev, [monthName]: numVal };
      const subRes = distributeMonthActualToSubperiods(monthName, numVal, dailyActual, weeklyActual, holidaysEnabled, customHolidays);
      setWeeklyActual(subRes.nextWAct);
      setDailyActual(subRes.nextDAct);
      return nextM;
    });
  };

  const handleWeeklyChange = (weekIdx, val, monthName) => {
    const numVal = Math.round(parseFloat(val) || 0);
    const weekId = `${monthName}-Week${weekIdx + 1}`;
    setWeeklyAlloc(prev => {
      const nextW = { ...prev, [weekId]: numVal };

      const weekDays = getDaysInWeekRow(monthName, weekIdx);
      const workingDays = weekDays.filter(d => !checkIsHoliday(d).isHoliday);
      const wCount = workingDays.length || weekDays.length || 7;
      const baseDay = Math.floor(numVal / wCount);
      let remDay = numVal - (baseDay * wCount);

      setDailyAlloc(dPrev => {
        const nextD = { ...dPrev };
        weekDays.forEach(d => {
          const check = checkIsHoliday(d);
          if (check.isHoliday) {
            nextD[d] = 0;
          } else {
            nextD[d] = baseDay + (remDay > 0 ? 1 : 0);
            if (remDay > 0) remDay--;
          }
        });
        return nextD;
      });

      return nextW;
    });
  };

  const handleWeeklyActualChange = (weekIdx, val, monthName) => {
    const numVal = Math.round(parseFloat(val) || 0);
    const weekId = `${monthName}-Week${weekIdx + 1}`;
    setWeeklyActual(prev => {
      const nextW = { ...prev, [weekId]: numVal };

      const weekDays = getDaysInWeekRow(monthName, weekIdx);
      const workingDays = weekDays.filter(d => !checkIsHoliday(d).isHoliday);
      const wCount = workingDays.length || weekDays.length || 7;
      const baseDay = Math.floor(numVal / wCount);
      let remDay = numVal - (baseDay * wCount);

      setDailyActual(dPrev => {
        const nextD = { ...dPrev };
        weekDays.forEach(d => {
          const check = checkIsHoliday(d);
          if (check.isHoliday) {
            nextD[d] = 0;
          } else {
            nextD[d] = baseDay + (remDay > 0 ? 1 : 0);
            if (remDay > 0) remDay--;
          }
        });
        return nextD;
      });

      return nextW;
    });
  };

  const handleDailyChange = (dateStr, val, monthName, weekIdx) => {
    const numVal = Math.round(parseFloat(val) || 0);
    setDailyAlloc(prev => {
      const nextD = { ...prev, [dateStr]: numVal };

      const weekDays = getDaysInWeekRow(monthName, weekIdx);
      const wSum = weekDays.reduce((sum, d) => sum + (nextD[d] || 0), 0);
      const weekId = `${monthName}-Week${weekIdx + 1}`;

      setWeeklyAlloc(wPrev => ({ ...wPrev, [weekId]: wSum }));

            if (isTimeKpi) {
        const mDays = getDaysInMonth(monthName);
        const mSum = mDays.reduce((sum, d) => sum + (nextD[d] || 0), 0);
        setMonthlyAlloc(mPrev => {
          const nextM = { ...mPrev, [monthName]: mSum };
          const totalSum = Object.values(nextM).reduce((a, b) => a + b, 0);
          setTotalTargetInput(totalSum);
          return nextM;
        });
      }

      return nextD;
    });
  };

  const handleDailyActualChange = (dateStr, val, monthName, weekIdx) => {
    // Read-only from Admin view: achievements are updated from mobile app.
    return;
  };

  // Revise target logic to roll over daily shortfalls to future working days
  const handleReviseTargets = () => {
    const nextRevised = { ...dailyAlloc };
    const days = getDaysInMonth(selectedMonth);

    let rolloverShortfall = 0;
    
    // Calculate shortfalls from past/logged days
    days.forEach(dStr => {
      const dayTarget = dailyAlloc[dStr] || 0;
      const dayActual = dailyActual[dStr] || 0;
      const holidayInfo = checkIsHoliday(dStr);
      const isLeave = dailyLeave[dStr];

      // If Sunday or custom holiday, target is set to 0. If it was originally targeted, count shortfall
      if (holidayInfo.isHoliday || isLeave) {
        nextRevised[dStr] = 0;
        if (dayTarget > 0 && dayActual < dayTarget) {
          rolloverShortfall += (dayTarget - dayActual);
        }
      } else {
        if (dayActual !== dayTarget && (dayActual > 0 || isLeave || holidayInfo.isHoliday)) {
          rolloverShortfall += (dayTarget - dayActual);
        }
      }
    });

    // Find future working days (exclude holidays, leaves, and days where actual is logged > 0)
    const futureWorkingDays = days.filter(dStr => {
      const holidayInfo = checkIsHoliday(dStr);
      const isLeave = dailyLeave[dStr];
      const dayActual = dailyActual[dStr] || 0;
      return !holidayInfo.isHoliday && !isLeave && dayActual === 0;
    });

    if (futureWorkingDays.length > 0 && rolloverShortfall > 0) {
      const addedPerDay = Math.floor(rolloverShortfall / futureWorkingDays.length);
      let rem = rolloverShortfall - (addedPerDay * futureWorkingDays.length);
      
      futureWorkingDays.forEach(dStr => {
        const extra = addedPerDay + (rem > 0 ? 1 : 0);
        if (rem > 0) rem--;
        nextRevised[dStr] = (dailyAlloc[dStr] || 0) + extra;
      });
    }

    setRevisedAlloc(nextRevised);
  };

  const toggleAdminHoliday = (dateStr) => {
    setCustomHolidays(prev => {
      const nextH = { ...prev };
      if (nextH[dateStr]) {
        delete nextH[dateStr];
      } else {
        nextH[dateStr] = true;
      }
      return nextH;
    });
  };

  const getSummedTotal = () => {
    return Object.values(monthlyAlloc).reduce((a, b) => a + b, 0);
  };

    useEffect(() => {
    if (!isTimeKpi) {
      handleReviseTargets();
    }
  }, [dailyAlloc, dailyActual, customHolidays, holidaysEnabled, selectedMonth, isTimeKpi]);

  // Automatically split monthly target evenly when holidays or holiday toggle changes
  useEffect(() => {
    if (!isTimeKpi) {
      const monthVal = monthlyAlloc[selectedMonth] || 0;
      setDailyAlloc(prevDaily => {
        setWeeklyAlloc(prevWeekly => {
          const subRes = distributeMonthToSubperiods(selectedMonth, monthVal, prevDaily, prevWeekly);
          return subRes.nextW;
        });
        const subRes = distributeMonthToSubperiods(selectedMonth, monthVal, prevDaily, weeklyAlloc);
        return subRes.nextD;
      });
    }
  }, [customHolidays, holidaysEnabled, selectedMonth, isTimeKpi]);

  const summedTotal = getSummedTotal();
  const isTallied = summedTotal === (Math.round(parseFloat(totalTargetInput) || 0));

  const canSubmit = name.trim();

  const handleSubmit = () => {
    onSubmit({
      ...kpi,
      name,
      description,
      unit,
      direction,
      team,
      owner,
      driveBy,
      monitorBy,
      weightage,
      target: summedTotal,
      monthlyAlloc,
      monthlyActual,
      weeklyAlloc,
      weeklyActual,
      dailyAlloc,
      dailyActual,
      revisedAlloc,
      customHolidays,
      holidaysEnabled,
      targetType: distributeEnabled ? "daily" : "monthly",
      targetsList: Object.entries(dailyAlloc).filter(([_, val]) => val > 0).map(([dStr, val]) => ({ id: dStr, label: dStr, targetValue: val, targetDate: dStr }))
    });
    onClose();
  };

  
  return (
    <div className={`fixed inset-y-0 right-0 left-0 lg:${sidebarMinimized ? "left-12" : "left-44"} bg-white flex flex-col p-4 sm:p-6 overflow-hidden shadow-2xl z-40 transition-all duration-300`}>
      <div className="w-full h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-orange-100 pb-3 mb-4 shrink-0">
          <div>
            <h3 className="font-bold text-slate-950 text-lg" style={{ fontFamily: "Poppins, sans-serif" }}>{kpi.id ? "Edit KPI & Target Distribution" : "Add KPI & Target Distribution"}</h3>
            <p className="text-xs text-slate-600 truncate max-w-xl">{kpi.name}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-6 w-6" /></button>
        </div>

        {/* 2-Column Main Content Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-8 gap-6 min-h-0 mb-4">          
          {/* LEFT COLUMN: KPI METADATA DETAILS (takes 2/8 columns) */}
          <div className="lg:col-span-2 space-y-4 overflow-y-auto pr-3 lg:border-r lg:border-slate-100 pb-2">
            <div>
              <label className="text-xs font-bold text-slate-600 mb-1 block uppercase tracking-wider">KPI Name *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-orange-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 font-semibold" />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 mb-1 block uppercase tracking-wider">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full border border-orange-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300" placeholder="KPI expectations, metrics, and details..." />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 mb-1 block uppercase tracking-wider">Unit</label>
              <select value={unit.trim()} onChange={(e) => setUnit(e.target.value)} className="w-full border border-orange-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-300 font-semibold">
                <option value="Nos">Nos</option>
                <option value="%">%</option>
                <option value="Time">Time</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 mb-1 block uppercase tracking-wider">Direction</label>
              <select value={direction} onChange={(e) => setDirection(e.target.value)} className="w-full border border-orange-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-300 font-semibold">
                <option value="higher font-semibold">Higher is better</option>
                <option value="lower font-semibold">Lower is better</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Team</label>
                <button 
                  onClick={() => setShowAddTeam(!showAddTeam)} 
                  className="text-[10px] text-teal-600 hover:text-teal-700 font-bold hover:underline"
                  type="button"
                >
                  + Add Team
                </button>
              </div>
              {showAddTeam ? (
                <div className="space-y-1.5 p-2 bg-orange-50/40 rounded-xl border border-orange-100">
                  <input 
                    type="text" 
                    value={newTeamName} 
                    onChange={(e) => setNewTeamName(e.target.value)} 
                    placeholder="New team name..." 
                    className="w-full border border-orange-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-teal-300"
                  />
                  <div className="flex gap-1">
                    <button 
                      onClick={() => {
                        if (newTeamName.trim()) {
                          const newT = { id: Date.now(), name: newTeamName, members: [] };
                          if (onAddVertical) onAddVertical(newT);
                          setTeam(newTeamName);
                          setOwner("");
                          setNewTeamName("");
                          setShowAddTeam(false);
                        }
                      }}
                      className="bg-teal-500 hover:bg-teal-600 text-white text-[10px] font-bold px-2 py-1 rounded"
                      type="button"
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => setShowAddTeam(false)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-1 rounded"
                      type="button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <select value={team} onChange={(e) => { setTeam(e.target.value); setOwner(""); }} className="w-full border border-orange-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-300 font-semibold">
                  {teams.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                </select>
              )}
            </div>

            <div className="border-t border-orange-100 pt-3 space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Do (Owner) <span className="text-rose-500">*</span></label>
                  <button 
                    onClick={() => setShowAddMember(!showAddMember)} 
                    className="text-[10px] text-teal-600 hover:text-teal-700 font-bold hover:underline"
                    type="button"
                  >
                    + Add Owner
                  </button>
                </div>
                {showAddMember ? (
                  <div className="space-y-1.5 p-2 bg-orange-50/40 rounded-xl border border-orange-100">
                    <input 
                      type="text" 
                      value={newMemberName} 
                      onChange={(e) => setNewMemberName(e.target.value)} 
                      placeholder="Name..." 
                      className="w-full border border-orange-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-teal-300"
                    />
                    <input 
                      type="text" 
                      value={newMemberDesignation} 
                      onChange={(e) => setNewMemberDesignation(e.target.value)} 
                      placeholder="Designation..." 
                      className="w-full border border-orange-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-teal-300"
                    />
                    <div className="flex gap-1">
                      <button 
                        onClick={() => {
                          if (newMemberName.trim()) {
                            const selectedTeamObj = teams.find(t => t.name === team);
                            if (selectedTeamObj && onAddMember) {
                              const newM = { id: Date.now(), name: newMemberName, designation: newMemberDesignation };
                              onAddMember(selectedTeamObj.id, newM);
                              setOwner(newMemberName);
                              setNewMemberName("");
                              setShowAddMember(false);
                            }
                          }
                        }}
                        className="bg-teal-500 hover:bg-teal-600 text-white text-[10px] font-bold px-2 py-1 rounded"
                        type="button"
                      >
                        Save
                      </button>
                      <button 
                        onClick={() => setShowAddMember(false)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-1 rounded"
                        type="button"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <select value={owner} onChange={(e) => setOwner(e.target.value)} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-300 font-semibold">
                    <option value="">Select owner (Do)...</option>
                    {ownerOptions.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                  </select>
                )}
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 mb-1 block uppercase tracking-wider">Drive (Optional)</label>
                <select value={driveBy} onChange={(e) => setDriveBy(e.target.value)} className="w-full border border-orange-200 rounded-xl px-2.5 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-300 font-semibold">
                  <option value="">Select Drive...</option>
                  {ownerOptions.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 mb-1 block uppercase tracking-wider">Monitor (Optional)</label>
                <select value={monitorBy} onChange={(e) => setMonitorBy(e.target.value)} className="w-full border border-orange-200 rounded-xl px-2.5 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-300 font-semibold">
                  <option value="">Select Monitor...</option>
                  {ownerOptions.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: TARGET SCHEDULING & DISTRIBUTION (takes 6/8 columns) */}
          <div className="lg:col-span-6 flex flex-col min-h-0 space-y-4 pl-3">
            {/* Target Assignment Info Header */}
            <div className="bg-orange-50/20 p-3 rounded-2xl border border-orange-100/50 shrink-0 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-slate-800 block">Target & Achievement Planning</span>
                <span className="text-xs text-slate-500 block mt-0.5">
                  {isTimeKpi 
                    ? "Click dates in the calendar to assign completion deadlines. (Achievements are updated via the mobile app)."
                    : "Input monthly target values below. (Achievements are read-only and updated via the mobile app)."}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setHolidaysEnabled(!holidaysEnabled)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all border ${
                    holidaysEnabled ? "bg-orange-100 text-orange-800 border-orange-200" : "bg-slate-100 text-slate-500 border-slate-200"
                  }`}
                >
                  {holidaysEnabled ? "Disable Holidays" : "Enable Holidays"}
                </button>
              </div>
            </div>

            {/* Scrollable Month Line Editor (Grid: fits all 12 on one screen width) */}
            <div className="shrink-0">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-600 block uppercase tracking-wider">Monthly Targets & Achievements (FY 2026-27) *</label>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-600 select-none">
                  <input 
                    type="checkbox" 
                    checked={distributeEnabled} 
                    onChange={(e) => setDistributeEnabled(e.target.checked)} 
                    className="w-4 h-4 rounded border-orange-200 text-teal-600 focus:ring-teal-300"
                  />
                  Enable Distribute (Daily/Weekly)
                </label>
              </div>
              <div className="grid grid-cols-6 lg:grid-cols-12 gap-1.5">
                {["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"].map(m => {
                  const val = monthlyAlloc[m] || 0;
                  const act = monthlyActual[m] || 0;
                  const isSelected = selectedMonth === m;
                  return (
                    <div
                      key={m}
                      onClick={() => setSelectedMonth(m)}
                      className={`border rounded-xl p-2 text-center cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected ? "bg-teal-50/50 border-teal-500 shadow-sm ring-2 ring-teal-100" : "bg-white border-orange-100 hover:border-orange-200"
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-600 block mb-1 uppercase tracking-wider">{m}</span>
                      {isTimeKpi ? (
                        <div className="w-full text-center border border-orange-200 rounded-lg py-1 text-xs bg-slate-50 font-bold text-slate-700 mb-1" title="Target count (derived)">
                          T: {val} {val === 1 ? "day" : "days"}
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={formatIndianNumber(val)}
                          onChange={(e) => handleMonthlyChange(m, parseIndianNumber(e.target.value))}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full text-center border border-orange-200 rounded-lg py-1 text-xs focus:outline-none bg-white font-bold text-slate-800 mb-1"
                          placeholder="T:0"
                          title="Monthly Target"
                        />
                      )}
                      <div className="w-full text-center border border-emerald-200 rounded-lg py-1 text-xs bg-emerald-50/40 font-bold text-emerald-800" title="Monthly Achievement (Read-only)">
                        A: {formatIndianNumber(act) || "0"}
                      </div>
                    </div>
                );
            })}
              </div>
            </div>

            {/* Selected Month Breakdown Sub-view (Unified Calendar Grid with Weekly Total) */}
            {distributeEnabled && (
              <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200 pb-2 shrink-0 mb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    {selectedMonth} Target Breakdown: <span className="text-teal-600 font-extrabold">{formatIndianNumber(monthlyAlloc[selectedMonth] || 0)}</span> {unit}
                  </h4>
                  {(() => {
                    const days = getDaysInMonth(selectedMonth);
                    const monthDailySum = days.reduce((sum, dStr) => sum + (dailyAlloc[dStr] || 0), 0);
                    const monthMismatch = monthDailySum - (monthlyAlloc[selectedMonth] || 0);
                    return (
                      <div className="flex items-center gap-3">
                        <p className="text-xs text-slate-500">Allocated Daily Sum: <span className="font-bold text-slate-700">{formatIndianNumber(monthDailySum)}</span> {unit}</p>
                        {!isTimeKpi && monthMismatch !== 0 && (
                          <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md animate-pulse">
                            ⚠ Mismatch: {monthMismatch > 0 ? `+${formatIndianNumber(monthMismatch)}` : formatIndianNumber(monthMismatch)} {unit}
                          </span>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Scrollable grid section */}
              <div className="flex-1 min-h-0 overflow-x-auto pr-1">
                <div className="min-w-[650px] pr-1">
                  {/* 8-column calendar header */}
                <div className="grid grid-cols-8 gap-1.5 text-center mb-2.5 text-xs font-bold text-slate-500 shrink-0">
                  <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                  <div className="text-teal-700 font-bold">Week Total</div>
                </div>

                {/* Calendar Rows */}
                <div className="space-y-2">
                  {(() => {
                    const cells = getCalendarCells(selectedMonth);
                    const numRows = Math.ceil(cells.length / 7);
                    const rows = [];

                    for (let r = 0; r < numRows; r++) {
                      const rowCells = cells.slice(r * 7, (r + 1) * 7);
                      const weekId = `${selectedMonth}-Week${r + 1}`;
                      const weekVal = weeklyAlloc[weekId] || 0;
                      const weekActVal = weeklyActual[weekId] || 0;

                      rows.push(
                        <div key={r} className="grid grid-cols-8 gap-1.5 items-center">
                          {/* 7 Days of the Row */}
                          {rowCells.map((cell, cIdx) => {
                            if (!cell || cell.isEmpty) {
                              return <div key={`empty-${r}-${cIdx}`} className="bg-slate-100/20 rounded-xl h-[60px] border border-dashed border-slate-100" />;
                            }

                            const dayTarget = dailyAlloc[cell.dateStr] || 0;
                            const dayRevised = revisedAlloc[cell.dateStr] ?? dayTarget;
                            const dayActual = dailyActual[cell.dateStr] || 0;
                            const check = checkIsHoliday(cell.dateStr);

                            const isLeave = dailyLeave[cell.dateStr];
                            const isPartialLeave = dailyPartialLeave[cell.dateStr];

                            // Color scheme for cell
                            let cellBg = check.isHoliday 
                              ? (check.name === "Sunday" ? "bg-rose-50/40 border-rose-100/60" : "bg-amber-50/30 border-amber-100/80")
                              : "bg-white border-slate-200/60";
                            let tagColor = check.isHoliday ? "text-rose-600 font-bold" : "text-slate-400";

                            // Override backgrounds for Leave/Partial Leave
                            if (isLeave) {
                              cellBg = "bg-rose-100/30 border-rose-300";
                            } else if (isPartialLeave) {
                              cellBg = "bg-orange-50/50 border-orange-300";
                            }

                            // If selected for Time KPI
                            if (isTimeKpi && dayTarget > 0) {
                              cellBg = "bg-teal-50 border-teal-400 ring-2 ring-teal-100/50";
                            }

                            return (
                              <div
                                key={cell.dateStr}
                                onClick={() => {
                                  if (isTimeKpi) {
                                    handleDailyChange(cell.dateStr, dayTarget > 0 ? 0 : 1, selectedMonth, r);
                                  }
                                }}
                                className={`border rounded-xl p-1 text-center flex flex-col justify-between h-[60px] ${cellBg} shadow-sm transition-all hover:border-slate-300 ${isTimeKpi ? "cursor-pointer" : ""}`}
                              >
                                <div className="flex justify-between items-center text-[10px] px-1 shrink-0">
                                  <span className="font-bold text-slate-600">{cell.dayNum}</span>
                                  <div className="flex gap-1 items-center">
                                    {check.isHoliday && !isTimeKpi && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleAdminHoliday(cell.dateStr);
                                        }}
                                        className={`scale-90 tracking-tighter ${tagColor} hover:underline`}
                                        title="Click to toggle custom holiday"
                                      >
                                        {check.name === "Sunday" ? "Sun" : "Hol"}
                                      </button>
                                    )}
                                    {!check.isHoliday && !isTimeKpi && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleAdminHoliday(cell.dateStr);
                                        }}
                                        className="scale-75 text-slate-300 hover:text-slate-600 font-bold"
                                        title="Mark as admin holiday"
                                      >
                                        +Hol
                                      </button>
                                    )}
                                    {isTimeKpi && dayTarget > 0 && (
                                      <span className="text-[9px] text-teal-700 font-extrabold tracking-tighter">Deadline</span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-col gap-0.5 mt-0.5">
                                  {isTimeKpi ? (
                                    <div className="flex flex-col items-center justify-center gap-0.5">
                                      <span className={`text-[10px] font-bold ${dayTarget > 0 ? "text-teal-700" : "text-slate-300"}`}>
                                        {dayTarget > 0 ? "🎯 Target Set" : "—"}
                                      </span>
                                      <span className={`text-[10px] font-bold ${dayActual > 0 ? "text-emerald-700" : "text-slate-300"}`}>
                                        {dayActual > 0 ? "✓ Completed" : "—"}
                                      </span>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="flex items-center justify-center gap-1 leading-none">
                                        <input
                                          type="text"
                                          value={formatIndianNumber(dayTarget)}
                                          onChange={(e) => handleDailyChange(cell.dateStr, parseIndianNumber(e.target.value), selectedMonth, r)}
                                          className="w-12 text-center text-xs focus:outline-none bg-transparent font-bold text-slate-800 border-b border-dashed border-slate-100"
                                          placeholder="T:0"
                                          title="Original Target"
                                        />
                                        {dayRevised !== dayTarget && dayActual !== dayTarget && (
                                          <span className="text-[9px] text-teal-700 font-extrabold bg-teal-50 border border-teal-100 px-0.5 rounded" title="Revised Target">
                                            R:{formatIndianNumber(dayRevised)}
                                          </span>
                                        )}
                                      </div>
                                      <div className="w-full text-center text-xs font-bold text-emerald-800 leading-none h-4" title="Achievement (Read-only)">
                                        {dayActual > 0 ? `A:${formatIndianNumber(dayActual)}` : "A:0"}
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            );
                          })}

                          {/* 8th Column: Weekly Total */}
                          <div className="border border-teal-200 rounded-xl p-1 text-center flex flex-col justify-between h-[60px] bg-teal-50/60 shadow-sm transition-all hover:border-teal-300">
                            <span className="text-[9px] font-bold text-teal-850 block uppercase tracking-wider font-mono shrink-0">W{r + 1} Total</span>
                            <div className="flex flex-col gap-0.5 mt-0.5">
                              {isTimeKpi ? (
                                <div className="flex flex-col items-center justify-center gap-0.5">
                                  <span className="text-[10px] font-bold text-teal-800">T: {weekVal}</span>
                                  <span className="text-[10px] font-bold text-emerald-800">A: {weekActVal}</span>
                                </div>
                              ) : (
                                <>
                                  <div className="w-full text-center text-xs font-extrabold text-teal-900 leading-none h-4" title="Weekly Target (Derived)">
                                    T: {formatIndianNumber(weekVal) || "0"}
                                  </div>
                                  <div className="w-full text-center text-xs font-bold text-emerald-800 leading-none h-4" title="Weekly Achievement (Read-only)">
                                    {weekActVal > 0 ? `A:${formatIndianNumber(weekActVal)}` : "A:0"}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return rows;
                  })()}
                </div>
                </div>
              </div>
            </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-orange-100 pt-4 mt-auto shrink-0">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            disabled={!canSubmit}
            onClick={handleSubmit}
            className="flex-1 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-200 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-xl transition-colors text-sm shadow-sm"
          >
            Save Target Assignments
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==================== ADMIN APP ==================== */

const ADMIN_NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "kpis", label: "KPIs", icon: Target },
  { id: "okrs", label: "OKRs", icon: TrendingUp },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "teams", label: "Teams", icon: Users },
  { id: "campaigns", label: "Campaigns", icon: Megaphone },
  { id: "settings", label: "Settings", icon: Settings },
];

function AdminApp({ kpis, onLog, teams, onAddMember, onAddVertical, onAddKpi, projects, onAddProject, onUpdateProjectStage, onEditKpi, onDeleteKpi, onDeleteProject, onUploadKpis }) {
  const [activeMemberKpis, setActiveMemberKpis] = useState(null);
  const [activeTeamId, setActiveTeamId] = useState(1);
  const [activeMemberFilter, setActiveMemberFilter] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [addKpiOpen, setAddKpiOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [addProjectOpen, setAddProjectOpen] = useState(false);
  const [editingKpi, setEditingKpi] = useState(null);
  const [kpiView, setKpiView] = useState("list");
  const [showTemplate, setShowTemplate] = useState(false);
  const [uploadTeam, setUploadTeam] = useState("");
  const [uploadOwner, setUploadOwner] = useState("");
  const [uploadDrive, setUploadDrive] = useState("");
  const [uploadMonitor, setUploadMonitor] = useState("");

  const handleDownloadTemplate = () => {
    const headers = [
      ["KPI no", "KPI", "Team", "Owner", "Drive", "Reporting To", "UOM", "UP/ Down", "CY Target", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]
    ];
    const sampleRow = [
      "1", 
      "No of digital enquiry resulted in sales - Domestic", 
      "Digital Marketing", 
      "Aditi Rao", 
      "Anand Kumar", 
      "Pooja Mehta", 
      "Nos", 
      "UP", 
      "400", 
      "5500", "5500", "5500", "6000", "6000", "6000", "6500", "6500", "6500", "7000", "7000", "7000"
    ];
    const worksheet = XLSX.utils.aoa_to_sheet([headers[0], sampleRow]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "KPI Template");
    XLSX.writeFile(workbook, "KPI_Upload_Template.xlsx");
  };

  const handleExcelTargetChange = async (kpi, monthName, val) => {
    const numVal = Math.round(parseFloat(val) || 0);
    const nextM = { ...(kpi.monthlyAlloc || {}) };
    
    ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"].forEach(m => {
      if (nextM[m] === undefined) {
        nextM[m] = Math.round(((kpi.target || 0) / 12) * 100) / 100;
      }
    });
    nextM[monthName] = numVal;

    const totalTarget = Object.values(nextM).reduce((a, b) => a + b, 0);

    const { nextW, nextD } = distributeMonthToSubperiods(
      monthName, 
      numVal, 
      kpi.dailyAlloc || {}, 
      kpi.weeklyAlloc || {}, 
      kpi.holidaysEnabled !== false, 
      kpi.customHolidays || {}
    );

    const updatedKpi = {
      ...kpi,
      target: totalTarget,
      monthlyAlloc: nextM,
      weeklyAlloc: nextW,
      dailyAlloc: nextD,
      targetsList: Object.entries(nextD).filter(([_, v]) => v > 0).map(([dStr, v]) => ({ id: dStr, label: dStr, targetValue: v, targetDate: dStr }))
    };

    onEditKpi(updatedKpi);
  };

  const [isEditingGrid, setIsEditingGrid] = useState(false);

  const handleExcelActualChange = async (kpi, monthName, val) => {
    const numVal = parseFloat(val) || 0;
    const year = ["Jan", "Feb", "Mar"].includes(monthName) ? 2027 : 2026;
    const monthKey = `${monthName} ${year}`;
    
    const nextActuals = { ...(kpi.monthlyActual || {}) };
    nextActuals[monthKey] = numVal;

    const updatedKpi = {
      ...kpi,
      monthlyActual: nextActuals
    };
    onEditKpi(updatedKpi);
  };

  const handleExcelCellChange = async (kpi, field, val) => {
    let updatedKpi = { ...kpi };

    if (field === "name") updatedKpi.name = val;
    else if (field === "team") updatedKpi.team = val;
    else if (field === "owner") updatedKpi.owner = val;
    else if (field === "driveBy") updatedKpi.driveBy = val;
    else if (field === "monitorBy") updatedKpi.monitorBy = val;
    else if (field === "unit") updatedKpi.unit = val.startsWith(" ") ? val : " " + val;
    else if (field === "direction") updatedKpi.direction = val;
    else if (field === "target") updatedKpi.target = parseFloat(val) || 0;

    onEditKpi(updatedKpi);
  };

  const [screen, setScreen] = useState("dashboard");
  const [detailId, setDetailId] = useState(null);
  const [loggingId, setLoggingId] = useState(null);
  const [teamFilter, setTeamFilter] = useState("All teams");
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [addVerticalOpen, setAddVerticalOpen] = useState(false);

  const sidebarMinimized = !!activeMemberKpis || (screen === "teams" && activeMemberFilter !== null);

  const teamOptions = ["All teams", ...new Set(kpis.map((k) => k.team))];
  const filteredKpis = teamFilter === "All teams" ? kpis : kpis.filter((k) => k.team === teamFilter);
  const kpisByTeam = useMemo(() => {
    const groups = {};
    filteredKpis.forEach(k => {
      if (!groups[k.team]) {
        groups[k.team] = [];
      }
      groups[k.team].push(k);
    });
    return groups;
  }, [filteredKpis]);
  const onTrackCount = kpis.filter((k) => getStatus(k) === "on-track").length;

  const detailKpi = kpis.find((k) => k.id === detailId);
  const loggingKpi = kpis.find((k) => k.id === loggingId);

  return (
    <div className="flex bg-orange-50 rounded-2xl overflow-hidden border border-orange-100 flex-1 w-full h-full relative">
      {/* Mobile Sidebar Overlay Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside className={`bg-white border-r border-orange-100 flex flex-col h-full transition-all duration-300 shrink-0
        fixed inset-y-0 left-0 z-40 md:relative md:translate-x-0 shadow-lg md:shadow-none
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        ${sidebarMinimized ? "md:w-12" : "md:w-44"}
      `}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-orange-100">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-orange-300 to-teal-300 flex items-center justify-center shrink-0">
              <span className="text-white font-semibold text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>P</span>
            </div>
            {!sidebarMinimized && <span className="font-semibold text-slate-900" style={{ fontFamily: "Poppins, sans-serif" }}>PulseKPI</span>}
          </div>
          {mobileMenuOpen && (
            <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 md:hidden">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <nav className="flex-1 px-2.5 py-4 space-y-1 overflow-y-auto">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = screen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setScreen(item.id);
                  setActiveMemberKpis(null); // auto expand if navigating screens
                  setMobileMenuOpen(false); // auto close mobile menu
                }}
                title={sidebarMinimized ? item.label : ""}
                className={`w-full flex items-center rounded-xl text-sm font-medium transition-colors ${
                  sidebarMinimized ? "justify-center p-2" : "gap-2.5 px-3 py-2"
                } ${
                  isActive ? "bg-orange-100 text-orange-700" : "text-slate-500 hover:bg-orange-50"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!sidebarMinimized && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-orange-100 flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-orange-200 flex items-center justify-center text-xs font-medium text-orange-800 shrink-0">AD</div>
          {!sidebarMinimized && (
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">Admin · Ravi</p>
              <p className="text-xs text-slate-400 truncate">BULL Machines</p>
            </div>
          )}
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="h-16 bg-white border-b border-orange-100 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="p-1.5 rounded-lg border border-orange-100 hover:bg-orange-50 text-slate-500 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-base sm:text-lg font-semibold text-slate-900 capitalize" style={{ fontFamily: "Poppins, sans-serif" }}>{screen}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden lg:block">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input placeholder="Search..." className="pl-9 pr-4 py-2 rounded-full bg-orange-50 border border-orange-100 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-teal-300" />
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-8 py-6">
          {screen === "dashboard" && (
            <>
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <StatCard icon={Star} iconBg="bg-orange-100" iconColor="text-orange-500" value={kpis.length} label="Active KPIs" />
                <StatCard icon={Mountain} iconBg="bg-teal-100" iconColor="text-teal-500" value={onTrackCount} label="On track" />
                <StatCard icon={UserCheck} iconBg="bg-rose-100" iconColor="text-rose-500" value={teams.reduce((a, t) => a + t.members.length, 0)} label="Employees tracked" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {kpis.map((kpi) => (
                  <button key={kpi.id} onClick={() => setDetailId(kpi.id)} className="text-left bg-white border border-orange-100 rounded-2xl p-4 hover:border-orange-200 hover:shadow-sm transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-sm font-medium text-slate-600">{kpi.name}</p>
                      <StatusBadge status={getStatus(kpi)} />
                    </div>
                    <p className="text-2xl font-semibold text-slate-900">{getLatest(kpi)}<span className="text-sm text-slate-400 ml-1">{kpi.unit}</span></p>
                    <p className="text-xs text-slate-400 mt-1">Target {kpi.target}{kpi.unit} · {kpi.team}</p>
                  </button>
                ))}
              </div>
            </>
          )}

          {screen === "kpis" && (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <select value={teamFilter} onChange={(e) => setTeamFilter(e.target.value)} className="appearance-none bg-white border border-orange-100 rounded-full pl-4 pr-9 py-2 text-sm text-slate-700 font-medium">
                      {teamOptions.map((t) => <option key={t}>{t}</option>)}
                    </select>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <div className="inline-flex bg-white border border-orange-100 rounded-full p-1">
                    {[
                      { id: "list", icon: List, label: "List" },
                      { id: "grid", icon: LayoutGrid, label: "Grid" },
                      { id: "excel", icon: Table, label: "Excel view" },
                      { id: "process", icon: GitBranch, label: "Process map" },
                    ].map((v) => {
                      const Icon = v.icon;
                      const isActive = kpiView === v.id;
                      return (
                        <button
                          key={v.id}
                          onClick={() => setKpiView(v.id)}
                          title={v.label}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${isActive ? "bg-teal-500 text-white" : "text-slate-500 hover:bg-orange-50"}`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">{v.label}</span>
                        </button>
                    );
                })}
                  </div>
                </div>
                <button onClick={() => setAddKpiOpen(true)} className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors">
                  <Plus className="h-4 w-4" /> Add KPI
                </button>
              </div>

              {kpiView === "list" && (
                <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-210px)] pr-1">
                  {Object.entries(kpisByTeam).map(([teamName, teamKpis]) => (
                    <div key={teamName} className="bg-white border border-orange-100 rounded-2xl shadow-sm overflow-hidden">
                      <div className="bg-orange-50/30 px-5 py-3 border-b border-orange-100 flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">{teamName}</h4>
                        <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">{teamKpis.length} {teamKpis.length === 1 ? "KPI" : "KPIs"}</span>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs min-w-[1000px] border-collapse">
                          <thead>
                            <tr className="border-b border-orange-50 text-left bg-slate-50/50">
                              <th className="px-5 py-2.5 font-bold text-slate-500 uppercase tracking-wider text-[10px]">KPI Title</th>
                              <th className="px-5 py-2.5 font-bold text-slate-500 uppercase tracking-wider text-[10px] w-1/4">Description</th>
                              <th className="px-5 py-2.5 font-bold text-slate-500 uppercase tracking-wider text-[10px]">UOM</th>
                              <th className="px-5 py-2.5 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Target Type / Value</th>
                              <th className="px-5 py-2.5 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Owner</th>
                              <th className="px-5 py-2.5 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Status</th>
                              <th className="px-5 py-2.5"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-orange-50">
                            {teamKpis.map((kpi) => (
                              <tr key={kpi.id} className="hover:bg-orange-50/20 cursor-pointer transition-colors" onClick={() => setDetailId(kpi.id)}>
                                <td className="px-5 py-3.5 font-bold text-slate-800 text-xs max-w-xs truncate">{kpi.name}</td>
                                <td className="px-5 py-3.5 text-slate-500 text-[11px] leading-relaxed max-w-xs truncate" title={kpi.description || `Key Performance Indicator: ${kpi.name}`}>
                                  {kpi.description || <span className="italic text-slate-350 font-normal">No description</span>}
                                </td>
                                <td className="px-5 py-3.5 text-slate-700">
                                  <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] text-slate-600 font-mono font-bold uppercase tracking-wider">{kpi.unit.trim()}</span>
                                </td>
                                <td className="px-5 py-3.5">
                                  <span className="capitalize font-bold text-slate-800 block text-[11px]">{kpi.targetType || "monthly"}</span>
                                  <span className="text-[10px] text-slate-400 block mt-0.5">{kpi.target}{kpi.unit}</span>
                                </td>
                                <td className="px-5 py-3.5 text-slate-600 text-[11px] space-y-1">
                                  <div><span className="text-[9px] font-bold uppercase text-teal-700 bg-teal-50 px-1 rounded mr-1">Do</span><span className="font-bold text-slate-750">{kpi.owner}</span></div>
                                  {kpi.driveBy && <div><span className="text-[9px] font-bold uppercase text-orange-700 bg-orange-50 px-1 rounded mr-1">Drive</span><span className="font-medium text-slate-600">{kpi.driveBy}</span></div>}
                                  {kpi.monitorBy && <div><span className="text-[9px] font-bold uppercase text-purple-700 bg-purple-50 px-1 rounded mr-1">Monitor</span><span className="font-medium text-slate-600">{kpi.monitorBy}</span></div>}
                                </td>
                                <td className="px-5 py-3.5"><StatusBadge status={getStatus(kpi)} /></td>
                                <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                                  <div className="flex justify-end gap-1.5">
                                    <button 
                                      onClick={() => setEditingKpi(kpi)} 
                                      className="text-teal-600 hover:text-teal-800 p-1.5 rounded-lg border border-teal-100 hover:bg-teal-50 transition-all"
                                      title="Edit KPI Targets"
                                    >
                                      <Pencil className="h-3.5 w-3.5" />
                                    </button>
                                    <button 
                                      onClick={() => onDeleteKpi && onDeleteKpi(kpi.id)} 
                                      className="text-rose-600 hover:text-rose-800 p-1.5 rounded-lg border border-rose-100 hover:bg-rose-50 transition-all"
                                      title="Delete KPI"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {kpiView === "grid" && (
                <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-210px)] pr-1">
                  {Object.entries(kpisByTeam).map(([teamName, teamKpis]) => (
                    <div key={teamName} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{teamName}</h4>
                        <div className="h-px bg-orange-100 flex-1"></div>
                        <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 border border-orange-100 rounded-full">{teamKpis.length}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {teamKpis.map((kpi) => (
                          <div key={kpi.id} onClick={() => setDetailId(kpi.id)} className="text-left bg-white border border-orange-100 rounded-2xl p-4 hover:border-orange-200 hover:shadow-sm transition-all cursor-pointer relative group">
                            <div className="flex items-start justify-between mb-3">
                              <p className="text-sm font-semibold text-slate-700 pr-6">{kpi.name}</p>
                              <StatusBadge status={getStatus(kpi)} />
                            </div>
                            <p className="text-2xl font-semibold text-slate-900">{getLatest(kpi)}<span className="text-sm text-slate-400 ml-1">{kpi.unit}</span></p>
                            
                            <div className="flex justify-between items-center mt-2 pt-2 border-t border-orange-50">
                              <div className="space-y-0.5 text-[10px]">
                                <div><span className="font-bold text-teal-700 bg-teal-50 px-1 rounded mr-1">Do:</span>{kpi.owner}</div>
                                {kpi.driveBy && <div><span className="font-bold text-orange-700 bg-orange-50 px-1 rounded mr-1">Drive:</span>{kpi.driveBy}</div>}
                                {kpi.monitorBy && <div><span className="font-bold text-purple-700 bg-purple-50 px-1 rounded mr-1">Monitor:</span>{kpi.monitorBy}</div>}
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={(e) => { e.stopPropagation(); setEditingKpi(kpi); }}
                                  className="text-teal-600 hover:text-teal-800 text-xs font-semibold px-2 py-0.5 rounded hover:bg-teal-50 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); onDeleteKpi && onDeleteKpi(kpi.id); }}
                                  className="text-rose-600 hover:text-rose-800 text-xs font-semibold px-2 py-0.5 rounded hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {kpiView === "excel" && (
                <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-210px)] pr-1">
                  {Object.entries(kpisByTeam).map(([teamName, teamKpis]) => (
                    <div key={teamName} className="bg-white border border-orange-100 rounded-2xl shadow-sm overflow-hidden">
                      <div className="bg-orange-50/30 px-5 py-3 border-b border-orange-100 flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">{teamName}</h4>
                        <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">{teamKpis.length} {teamKpis.length === 1 ? "KPI" : "KPIs"}</span>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs min-w-[1400px] border-collapse">
                          <thead>
                            <tr className="border-b border-orange-50 text-left bg-slate-50/50">
                              <th className="px-3 py-2.5 font-bold text-slate-500 uppercase tracking-wider text-[10px] w-48 sticky left-0 bg-slate-50/50 z-10">KPI Title</th>
                              <th className="px-3 py-2.5 font-bold text-slate-500 uppercase tracking-wider text-[10px] w-24">Do</th>
                              {["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"].map(m => (
                                <th key={m} className="px-2 py-2.5 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-center w-16">{m}</th>
                              ))}
                              <th className="px-3 py-2.5 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-center w-20">Total</th>
                              <th className="px-3 py-2.5 w-16"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-orange-50">
                            {teamKpis.map((kpi) => {
                              const totalVal = Object.values(kpi.monthlyAlloc || {}).reduce((sum, v) => sum + (v || 0), 0) || kpi.target || 0;
                              return (
                                <tr key={kpi.id} className="hover:bg-orange-50/20 cursor-pointer transition-colors" onClick={() => setDetailId(kpi.id)}>
                                  <td className="px-3 py-2.5 font-bold text-slate-800 text-xs max-w-xs truncate sticky left-0 bg-white hover:bg-orange-50/20 z-10">{kpi.name}</td>
                                  <td className="px-3 py-2.5 text-slate-600 font-medium text-[11px] truncate">{kpi.owner}</td>
                                  {["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"].map(m => {
                                    const val = kpi.monthlyAlloc?.[m] ?? Math.round(((kpi.target || 0) / 12) * 100) / 100;
                                    return (
                                      <td key={m} className="px-1.5 py-2 text-center" onClick={(e) => e.stopPropagation()}>
                                        <input 
                                          type="number"
                                          value={val}
                                          onChange={(e) => handleExcelTargetChange(kpi, m, e.target.value)}
                                          className="w-14 text-center border border-orange-100 hover:border-orange-200 focus:border-teal-400 bg-slate-50/50 hover:bg-white focus:bg-white rounded px-1 py-0.5 text-xs focus:outline-none transition-colors font-medium font-mono"
                                        />
                                      </td>
                                    );
                                  })}
                                  <td className="px-3 py-2.5 text-center font-bold text-slate-800 font-mono text-[11px]">
                                    {totalVal}
                                    <span className="text-[9px] text-slate-400 block font-normal mt-0.5">{kpi.unit.trim()}</span>
                                  </td>
                                  <td className="px-3 py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex justify-end gap-1">
                                      <button 
                                        onClick={() => setEditingKpi(kpi)} 
                                        className="text-teal-600 hover:text-teal-800 p-1 rounded-lg border border-teal-100 hover:bg-teal-50 transition-all"
                                        title="Calendar (Split Target)"
                                      >
                                        <CalendarRange className="h-3.5 w-3.5" />
                                      </button>
                                      <button 
                                        onClick={() => onDeleteKpi && onDeleteKpi(kpi.id)} 
                                        className="text-rose-600 hover:text-rose-800 p-1 rounded-lg border border-rose-100 hover:bg-rose-50 transition-all"
                                        title="Delete KPI"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {kpiView === "process" && (
                <div className="overflow-auto py-8 bg-slate-50/50 rounded-2xl border border-orange-100 flex flex-col items-center min-h-[500px]">
                  {/* Root: Company */}
                  <div className="flex flex-col items-center mb-8">
                    <div className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-2xl px-8 py-4 shadow-md text-center">
                      <p className="text-[10px] uppercase tracking-wider text-teal-100 font-bold">Company</p>
                      <h3 className="text-lg font-bold" style={{ fontFamily: "Poppins, sans-serif" }}>BULL Machines</h3>
                    </div>
                    <div className="w-0.5 h-8 bg-slate-300"></div>
                  </div>

                  {/* Departments */}
                  <div className="flex gap-16 justify-center w-full max-w-5xl px-6">
                    {[
                      {
                        name: "Marketing & Creative",
                        teamsList: ["Digital Marketing", "Video Production", "Graphic Design", "Expo", "Marketing Research"]
                      },
                      {
                        name: "Operations & Customer Relations",
                        teamsList: ["Enquiry Management", "Printing, Circulation & Gifts"]
                      }
                    ].map((dept, deptIdx) => (
                      <div key={dept.name} className="flex flex-col items-center flex-1 max-w-md">
                        {/* Department Card */}
                        <div className="bg-teal-50 border border-teal-200 text-teal-800 rounded-xl px-6 py-3 shadow-sm text-center w-64">
                          <p className="text-[9px] uppercase tracking-wider text-teal-600 font-bold">Department</p>
                          <h4 className="text-sm font-semibold">{dept.name}</h4>
                        </div>
                        <div className="w-0.5 h-6 bg-slate-300"></div>

                        {/* Teams Grid */}
                        <div className="flex flex-col gap-6 w-full">
                          {dept.teamsList.map((teamName) => {
                            const team = teams.find(t => t.name === teamName);
                            if (!team) return null;
                            return (
                              <div key={team.id} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex flex-col gap-3">
                                <div className="border-b border-orange-50 pb-2">
                                  <span className="text-[9px] uppercase tracking-wider bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-semibold">Team</span>
                                  <h5 className="text-sm font-semibold text-slate-800 mt-1">{team.name}</h5>
                                  <p className="text-[10px] text-slate-500 mt-0.5">Lead: {team.lead}</p>
                                </div>
                                
                                {/* Members List */}
                                <div className="space-y-1.5">
                                  {team.members.map(member => (
                                    <div key={member.id} className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-orange-50/50 hover:bg-orange-50 transition-colors">
                                      <div>
                                        <p className="font-medium text-slate-700">{member.name}</p>
                                        <p className="text-[9px] text-slate-400">{member.designation}</p>
                                      </div>
                                      <span className="text-[9px] text-slate-400 bg-white border border-slate-100 px-1.5 py-0.5 rounded">{member.employeeId}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                          );
                      })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {screen === "okrs" && (
            <div className="space-y-4">
              {okrsData.map((okr) => (
                <div key={okr.id} className="bg-white border border-orange-100 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">{okr.level}</span>
                    <span className="text-xs text-slate-400">{okr.owner}</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>{okr.objective}</h3>
                  <div className="space-y-3">
                    {okr.keyResults.map((kr) => {
                      const kpi = kpis.find((k) => k.id === kr.linkedKpiId);
                      const pct = kpi ? progressPct(kpi) : 0;
                      return (
                        <div key={kr.id}>
                          <div className="flex items-center justify-between mb-1">
                            <button onClick={() => kpi && setDetailId(kpi.id)} className="text-sm text-slate-700 hover:text-teal-700">{kr.name}</button>
                            <span className="text-xs font-medium text-slate-500">{pct}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-orange-50 overflow-hidden">
                            <div className="h-full bg-teal-400 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {screen === "teams" && (() => {
            const registeredNames = new Set(teams.flatMap(t => t.members.map(m => m.name)));
            const unassignedOwners = [...new Set(kpis.map(k => k.owner).filter(name => name && !registeredNames.has(name)))];

            // Filter KPIs by active member filter
            let displayedKpis = kpis;
            if (activeMemberFilter) {
              displayedKpis = kpis.filter(k => k.owner === activeMemberFilter || k.driveBy === activeMemberFilter || k.monitorBy === activeMemberFilter);
            }

            const showKpiPanel = activeMemberFilter !== null;

            return (
              <div className="flex gap-4 h-full overflow-hidden flex-1 items-start w-full">
                
                {/* LEFT PANE: TEAM & HIERARCHY TREE */}
                <div className={`${showKpiPanel ? "w-80" : "flex-1"} bg-white border border-orange-100 rounded-2xl p-5 flex flex-col h-full overflow-hidden transition-all duration-300`}>
                  <div className="flex items-center justify-between border-b border-orange-100 pb-3 mb-4 shrink-0">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Teams & Hierarchy Tree</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Explore organizational structure and click members to view their KPIs.</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setAddMemberOpen(true)} 
                        className="text-xs text-teal-600 hover:text-teal-700 font-bold bg-teal-50 border border-teal-100 px-3 py-1.5 rounded-xl transition-all"
                      >
                        + Player
                      </button>
                      <button 
                        onClick={() => setAddVerticalOpen(true)} 
                        className="text-xs text-teal-650 hover:text-teal-700 font-bold bg-teal-50 border border-teal-100 px-3 py-1.5 rounded-xl transition-all"
                      >
                        + Team
                      </button>
                    </div>
                  </div>

                  {/* Scrollable list of all teams and their hierarchy trees */}
                  <div className="flex-1 overflow-y-auto space-y-6 pr-1">
                    {teams.map(t => {
                      const leadMember = t.members.find(m => m.name === t.lead) || t.members[0];

                      const RenderTreeNode = ({ member, level }) => {
                        const isSelected = activeMemberFilter === member.name;
                        const isLead = member.name === t.lead;
                        const directReports = t.members.filter(m => m.reportingManager === member.name && m.name !== member.name);

                        return (
                          <div className="pl-3 relative space-y-1 mt-1 ml-1">
                            
                            <div 
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isSelected) {
                                  setActiveMemberFilter(null);
                                } else {
                                  setActiveMemberFilter(member.name);
                                  setActiveTeamId(t.id);
                                }
                              }}
                              className={`p-1.5 rounded-lg border text-left transition-all cursor-pointer shadow-sm hover:shadow-md w-full max-w-[220px] ${
                                isSelected 
                                  ? "bg-teal-50 border-teal-400 ring-2 ring-teal-100/50"
                                  : (isLead ? "bg-orange-50/50 border-orange-200" : "bg-white border-slate-100 hover:border-slate-200")
                              }`}
                              style={{ fontFamily: "'Google Sans', 'Product Sans', 'Segoe UI', sans-serif" }}
                            >
                              <div className="flex justify-between items-center gap-1.5">
                                <span className="font-bold text-slate-800 text-[13px] block truncate">{member.name}</span>
                                {isLead && <span className="text-[8px] bg-orange-200 text-orange-850 px-1.5 py-0.5 rounded uppercase font-extrabold shrink-0">Lead</span>}
                              </div>
                              <span className="text-[11px] text-slate-500 block truncate mt-0.5">{member.designation}</span>
                              
                              <div className="flex justify-between items-center mt-1">
                                <span className="text-[10px] text-slate-400 font-medium">{member.experience} yrs exp</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveTeamId(t.id);
                                    setAddMemberOpen(true);
                                  }}
                                  className="text-[10px] text-teal-600 hover:text-teal-700 font-bold"
                                >
                                  + Sub
                                </button>
                              </div>
                            </div>

                            {directReports.map(report => (
                              <RenderTreeNode key={report.id} member={report} level={level + 1} />
                            ))}
                          </div>
                        );
                      };

                      return (
                        <div key={t.id} className="bg-orange-50/20 border border-orange-100/30 rounded-2xl p-4 space-y-3 w-full max-w-[400px]">
                          {/* Team Card Header (Offset level 0) */}
                          <div className="flex justify-between items-start border-b border-orange-100 pb-2">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm font-extrabold text-slate-850">📂 {t.name}</span>
                              </div>
                              <p className="text-xs text-slate-500 mt-1">{t.description}</p>
                            </div>
                          </div>

                          {/* Team Hierarchy Tree Start */}
                          <div className="pl-1">
                            {leadMember ? (
                              <RenderTreeNode member={leadMember} level={1} />
                            ) : (
                              <p className="text-xs text-slate-400 italic pl-4">No members assigned to this team.</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* RIGHT PANE: KPI LIST SIDE-PANEL (Only visible when a member is clicked) */}
                {showKpiPanel && (
                  <div className="flex-1 bg-white border border-orange-100 rounded-2xl p-5 flex flex-col h-full overflow-hidden transition-all duration-300">
                    <div className="flex items-center justify-between border-b border-orange-100 pb-3 mb-4 shrink-0">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
                          KPIs of {activeMemberFilter}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">List of metrics, role distributions, and target tallies.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setAddKpiOpen(true)} className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors">
                          <Plus className="h-4.5 w-4.5" /> Add KPI
                        </button>
                        <button 
                          onClick={() => setActiveMemberFilter(null)} 
                          className="text-xs text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl font-semibold transition-colors"
                        >
                          Close Panel
                        </button>
                      </div>
                    </div>

                    {/* Table area for KPIs */}
                    <div className="flex-1 overflow-y-auto pr-1">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="border-b border-orange-100 bg-orange-50/20 text-slate-500 font-bold uppercase tracking-wider">
                            <th className="px-4 py-3">KPI Title</th>
                            <th className="px-4 py-3">DO (Owner)</th>
                            <th className="px-4 py-3">Drive By</th>
                            <th className="px-4 py-3">Monitor By</th>
                            <th className="px-4 py-3 text-center">Lead Weightage</th>
                            <th className="px-4 py-3 text-center">Target Value</th>
                            <th className="px-4 py-3 text-center">Status</th>
                            <th className="px-4 py-3"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {displayedKpis.length === 0 ? (
                            <tr>
                              <td colSpan={8} className="text-center py-8 text-slate-400 italic">No KPIs found matching this user.</td>
                            </tr>
                          ) : (
                            displayedKpis.map((kpi, idx) => (
                              <tr 
                                key={kpi.id} 
                                onClick={() => setDetailId(kpi.id)}
                                className="border-b border-orange-50 hover:bg-orange-50/20 cursor-pointer transition-all"
                              >
                                <td className="px-4 py-3.5 font-bold text-slate-800 max-w-xs truncate" title={kpi.name}>{kpi.name}</td>
                                <td className="px-4 py-3.5 text-slate-700 font-medium">🙋‍♂️ {kpi.owner || "—"}</td>
                                <td className="px-4 py-3.5 text-slate-600 font-medium">⚡ {kpi.driveBy || "—"}</td>
                                <td className="px-4 py-3.5 text-slate-600 font-medium">🔍 {kpi.monitorBy || "—"}</td>
                                <td className="px-4 py-3.5 text-center font-extrabold text-teal-700 bg-teal-50/30 rounded-lg">{kpi.weightage ? `${kpi.weightage}%` : "0%"}</td>
                                <td className="px-4 py-3.5 text-center font-extrabold text-slate-800">{kpi.target} {kpi.unit.trim()}</td>
                                <td className="px-4 py-3.5 text-center"><StatusBadge status={getStatus(kpi)} /></td>
                                <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                                  <button 
                                    onClick={() => setEditingKpi(kpi)}
                                    className="text-teal-600 hover:text-teal-800 text-[10px] font-bold px-2 py-1 rounded-lg border border-teal-100 hover:bg-teal-50"
                                  >
                                    Edit
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {screen === "campaigns" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {campaignsData.map((c) => (
                <div key={c.id} className="bg-white border border-orange-100 rounded-2xl p-5">
                  <h3 className="font-semibold text-slate-900 mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>{c.name}</h3>
                  <p className="text-xs text-slate-400 mb-3">{c.start} – {c.end} · {c.owner}</p>
                  <div className="space-y-2">
                    {c.linkedKpiIds.map((id) => {
                      const kpi = kpis.find((k) => k.id === id);
                      if (!kpi) return null;
                      return (
                        <button key={id} onClick={() => setDetailId(id)} className="w-full flex items-center justify-between text-sm py-1.5 hover:text-teal-700 focus:outline-none">
                          <span className="text-slate-600 truncate max-w-[80%] text-left" title={kpi.name}>{kpi.name}</span>
                          <StatusBadge status={getStatus(kpi)} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {screen === "projects" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">Track initiatives, milestones, and linked KPI improvements.</p>
                <button onClick={() => setAddProjectOpen(true)} className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors shadow-sm">
                  <Plus className="h-4 w-4" /> New Project
                </button>
              </div>

              <div className="grid grid-cols-1 gap-5">
                {projects.map((proj) => {
                  return (
                    <div key={proj.id} className="bg-white border border-orange-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex-1 space-y-3">
                        <div>
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-base font-bold text-slate-900" style={{ fontFamily: "Poppins, sans-serif" }}>{proj.title}</h3>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100">
                                Active: {proj.stages[proj.currentStageIdx]?.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 ml-auto">
                              <button
                                onClick={() => setEditingProject(proj)}
                                className="text-teal-600 hover:text-teal-800 p-1.5 rounded-lg border border-teal-100 hover:bg-teal-50 transition-all"
                                title="Edit Project Details"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => onDeleteProject(proj.id)}
                                className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg border border-rose-100 hover:bg-rose-50 transition-all"
                                title="Delete Project"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100">
                              Active: {proj.stages[proj.currentStageIdx]?.name}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{proj.resultAndImprovement}</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-2 border-t border-slate-50">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Project Lead</span>
                            <span className="font-medium text-slate-700">{proj.leadName}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Connected KPIs</span>
                            {proj.linkedKpiIds && proj.linkedKpiIds.length > 0 ? (
                              <div className="flex flex-col gap-1 max-h-24 overflow-y-auto">
                                {proj.linkedKpiIds.map(id => {
                                  const kpi = kpis.find(k => k.id === id);
                                  if (!kpi) return null;
                                  return (
                                    <span key={id} className="font-medium text-teal-600 hover:underline cursor-pointer block truncate text-left" onClick={() => setDetailId(id)} title={kpi.name}>
                                      {kpi.name}
                                    </span>
                                  );
                                })}
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">None</span>
                            )}
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Target Date</span>
                            <span className="font-medium text-slate-700 flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5 text-orange-400" /> {proj.targetDate}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Team Roster</span>
                            <span className="font-medium text-slate-700 truncate block" title={proj.memberNames.join(", ")}>
                              {proj.memberNames.join(", ")}
                            </span>
                          </div>
                        </div>

                        {/* Stage Timeline */}
                        <div className="pt-4">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Project Stages & Timeline</p>
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative">
                            <div className="absolute left-3 top-3 bottom-3 sm:left-4 sm:right-4 sm:top-[14px] sm:translate-y-0 w-0.5 sm:w-[90%] h-[90%] sm:h-0.5 bg-orange-100 z-0"></div>

                            {proj.stages.map((stage, idx) => {
                              const isCompleted = stage.status === "completed";
                              const isCurrent = stage.status === "current";
                              return (
                                <div key={idx} className="flex sm:flex-col items-center gap-3 sm:gap-2 z-10 w-full sm:w-1/4 relative">
                                  <button
                                    onClick={() => {
                                      const nextStatus = isCompleted ? "current" : isCurrent ? "completed" : "current";
                                      onUpdateProjectStage(proj.id, idx, nextStatus);
                                    }}
                                    title="Click to toggle status"
                                    className={`h-7 w-7 rounded-full flex items-center justify-center border font-bold text-xs shadow-sm transition-all ${
                                      isCompleted 
                                        ? "bg-teal-500 border-teal-500 text-white" 
                                        : isCurrent 
                                          ? "bg-orange-400 border-orange-400 text-white animate-pulse" 
                                          : "bg-white border-orange-200 text-slate-400 hover:border-orange-300"
                                    }`}
                                  >
                                    {isCompleted ? "✓" : idx + 1}
                                  </button>
                                  <div className="text-left sm:text-center">
                                    <p className={`text-xs font-semibold ${isCurrent ? "text-orange-600" : isCompleted ? "text-teal-700" : "text-slate-500"}`}>{stage.name}</p>
                                    <p className="text-[9px] text-slate-400 flex items-center justify-start sm:justify-center gap-0.5 mt-0.5">
                                      <CalendarRange className="h-3 w-3" /> {stage.targetDate}
                                    </p>
                                  </div>
                                </div>
                            );
                        })}
                          </div>
                        </div>
                      </div>
                    </div>
                );
            })}
              </div>
            </div>
          )}

          {screen === "settings" && (
            <div className="space-y-6 w-full max-w-full px-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Organization info card */}
                <div className="bg-white border border-orange-100 rounded-2xl p-5 shadow-sm">
                  <h3 className="font-semibold text-slate-900 mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>Organization</h3>
                  <div className="space-y-3 text-sm">
                    <div><p className="text-slate-400 text-xs mb-1">Name</p><p className="text-slate-800 font-medium">BULL Machines</p></div>
                    <div><p className="text-slate-400 text-xs mb-1">Industry</p><p className="text-slate-800 font-medium">Manufacturing</p></div>
                    <div><p className="text-slate-400 text-xs mb-1">Plan</p><p className="text-slate-800 font-medium">Team</p></div>
                  </div>
                </div>

                {/* Database utilities upload/download card */}
                <div className="bg-white border border-orange-100 rounded-2xl p-5 shadow-sm space-y-4">
                  <h3 className="font-semibold text-slate-900" style={{ fontFamily: "Poppins, sans-serif" }}>Database Utilities</h3>
                  
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">KPI Excel Import / Export</h4>
                    <p className="text-xs text-slate-400">Download the KPI template, populate your KPI rows (with Team, Owner, Drive, and Reporting To), and upload it.</p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {/* Download Template Button */}
                      <button 
                        onClick={handleDownloadTemplate}
                        className="inline-flex items-center justify-center gap-1.5 bg-orange-100 hover:bg-orange-200 text-orange-800 text-xs font-bold px-3 py-2.5 rounded-xl cursor-pointer transition-colors shadow-sm border border-orange-200"
                      >
                        <Download className="h-4 w-4 text-orange-650" /> Download Template
                      </button>

                      {/* File Upload Button */}
                      <label 
                        className="inline-flex items-center justify-center gap-1.5 text-white bg-teal-500 hover:bg-teal-600 text-xs font-semibold px-3 py-2.5 rounded-xl cursor-pointer transition-colors shadow-sm"
                      >
                        <Plus className="h-4 w-4" /> Upload Excel File
                        <input 
                          type="file" 
                          accept=".xlsx, .xls" 
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = async (evt) => {
                              try {
                                const arrayBuffer = evt.target.result;
                                const data = new Uint8Array(arrayBuffer);
                                const workbook = XLSX.read(data, { type: "array" });
                                const sheetName = workbook.SheetNames[0];
                                const worksheet = workbook.Sheets[sheetName];
                                const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                                
                                // Find header row
                                let headerIdx = -1;
                                for (let i = 0; i < rows.length; i++) {
                                  const row = rows[i];
                                  if (row && (row.includes("KPI no") || row.includes("KPI"))) {
                                    headerIdx = i;
                                    break;
                                  }
                                }
                                
                                if (headerIdx === -1) {
                                  alert("Invalid Excel template. Could not find header row with 'KPI no' or 'KPI' columns.");
                                  return;
                                }
                                
                                const headers = rows[headerIdx].map(h => String(h || "").trim());
                                const kpiIdx = headers.indexOf("KPI");
                                const teamIdx = headers.indexOf("Team");
                                const ownerIdx = headers.indexOf("Owner");
                                const driveIdx = headers.indexOf("Drive");
                                const repToIdx = headers.indexOf("Reporting To");
                                const uomIdx = headers.indexOf("UOM");
                                const directionIdx = headers.indexOf("UP/ Down");
                                const targetIdx = headers.indexOf("CY Target");
                                
                                const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
                                const monthColIdxs = months.map(m => headers.indexOf(m));

                                const parsedKpis = [];
                                
                                for (let i = headerIdx + 1; i < rows.length; i++) {
                                  const row = rows[i];
                                  if (!row || row.length === 0) continue;
                                  
                                  const kpiName = row[kpiIdx];
                                  if (!kpiName || String(kpiName).trim() === "" || String(kpiName).trim() === "NaN") continue;
                                  if (String(kpiName).toLowerCase() === "total") continue;

                                  const rowTeam = row[teamIdx] ? String(row[teamIdx]).trim() : "Digital Marketing";
                                  const rowOwner = row[ownerIdx] ? String(row[ownerIdx]).trim() : "Anand Kumar";
                                  const rowDrive = row[driveIdx] ? String(row[driveIdx]).trim() : "";
                                  const rowRepTo = row[repToIdx] ? String(row[repToIdx]).trim() : "";
                                  const unit = row[uomIdx] ? " " + String(row[uomIdx]).trim() : " Nos";
                                  const target = parseFloat(row[targetIdx]) || 0.0;
                                  
                                  let direction = "higher";
                                  const dirVal = String(row[directionIdx] || "").toLowerCase().trim();
                                  if (dirVal === "down" || dirVal === "lower") {
                                    direction = "lower";
                                  }

                                  const monthlyAlloc = {};
                                  const targetsList = [];
                                  
                                  months.forEach((m, idx) => {
                                    const colIdx = monthColIdxs[idx];
                                    if (colIdx !== -1 && row[colIdx] !== undefined && row[colIdx] !== null && row[colIdx] !== "") {
                                      const val = parseFloat(row[colIdx]);
                                      if (!isNaN(val)) {
                                        const year = ["Jan", "Feb", "Mar"].includes(m) ? 2027 : 2026;
                                        const monthKey = `${m} ${year}`;
                                        monthlyAlloc[monthKey] = val;
                                        
                                        let lastDay = "30";
                                        if (["Jan", "Mar", "May", "Jul", "Aug", "Oct", "Dec"].includes(m)) lastDay = "31";
                                        else if (m === "Feb") lastDay = "28";
                                        
                                        const monthNum = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(m) + 1;
                                        const padMonth = monthNum < 10 ? "0" + monthNum : monthNum;
                                        const targetDate = `${year}-${padMonth}-${lastDay}`;
                                        
                                        targetsList.push({
                                          id: monthKey,
                                          label: monthKey,
                                          targetValue: val,
                                          targetDate
                                        });
                                      }
                                    }
                                  });

                                  const history = [];
                                  if (targetsList.length > 0) {
                                    history.push({ d: "W1", v: targetsList[0].targetValue });
                                  } else {
                                    history.push({ d: "W1", v: 0 });
                                  }

                                  parsedKpis.push({
                                    name: String(kpiName).trim(),
                                    team: rowTeam,
                                    owner: rowOwner,
                                    driveBy: rowDrive,
                                    monitorBy: rowRepTo,
                                    unit,
                                    target: target || (targetsList.length > 0 ? targetsList[0].targetValue : 0),
                                    direction,
                                    history,
                                    monthlyAlloc,
                                    targetsList,
                                    targetType: "monthly"
                                  });
                                }
                                
                                if (parsedKpis.length === 0) {
                                  alert("No valid KPI rows found in the selected Excel sheet.");
                                  return;
                                }

                                if (window.confirm(`Are you sure you want to upload ${parsedKpis.length} KPIs from the Excel sheet?`)) {
                                  await onUploadKpis(parsedKpis, {
                                    useRowMetadata: true
                                  });
                                }
                              } catch (err) {
                                alert("Failed to parse Excel file: " + err.message);
                                console.error(err);
                              }
                            };
                            reader.readAsArrayBuffer(file);
                            e.target.value = ""; 
                          }}
                          className="hidden" 
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* KPI Excel Grid Sheet View */}
              <div className="bg-white border border-orange-100 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 text-base" style={{ fontFamily: "Poppins, sans-serif" }}>KPI Grid Spreadsheet</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Live spreadsheet of your KPIs. You can update values directly in the cells below.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setIsEditingGrid(!isEditingGrid)} 
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${isEditingGrid ? "bg-teal-500 hover:bg-teal-600 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      <span>{isEditingGrid ? "Exit Edit Mode" : "Edit Spreadsheet"}</span>
                    </button>
                    <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600">
                      <Table className="h-4 w-4" />
                      <span>Total Rows: {kpis.length}</span>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-[600px] overflow-y-auto relative">
                  <table className="w-full text-xs min-w-[2000px] border-collapse bg-white">
                    {/* Excel column labels row (A, B, C...) */}
                    <thead>
                      <tr className="bg-slate-100/70 border-b border-slate-200 text-center text-[10px] text-slate-400 font-mono">
                        <th className="border-r border-slate-200 py-1 sticky left-0 bg-slate-200 z-20" style={{ width: '80px', minWidth: '80px', maxWidth: '80px', left: '0px' }}>A</th>
                        <th className="border-r border-slate-200 py-1 sticky bg-slate-200 z-20" style={{ width: '400px', minWidth: '400px', maxWidth: '400px', left: '80px' }}>B</th>
                        <th className="border-r border-slate-200 py-1" style={{ width: '180px', minWidth: '180px', maxWidth: '180px' }}>C</th>
                        <th className="border-r border-slate-200 py-1" style={{ width: '150px', minWidth: '150px', maxWidth: '150px' }}>D</th>
                        <th className="border-r border-slate-200 py-1" style={{ width: '150px', minWidth: '150px', maxWidth: '150px' }}>E</th>
                        <th className="border-r border-slate-200 py-1" style={{ width: '150px', minWidth: '150px', maxWidth: '150px' }}>F</th>
                        <th className="border-r border-slate-200 py-1" style={{ width: '80px', minWidth: '80px', maxWidth: '80px' }}>G</th>
                        <th className="border-r border-slate-200 py-1" style={{ width: '80px', minWidth: '80px', maxWidth: '80px' }}>H</th>
                        <th className="border-r border-slate-200 py-1" style={{ width: '100px', minWidth: '100px', maxWidth: '100px' }}>I</th>
                        {["J","K","L","M","N","O","P","Q","R","S","T","U"].map((col) => (
                          <th key={col} className="border-r border-slate-200 py-1" style={{ width: '100px', minWidth: '100px', maxWidth: '100px' }}>{col}</th>
                        ))}
                      </tr>
                      {/* Table Column headers (KPI no, KPI, Team...) */}
                      <tr className="bg-slate-50 border-b border-slate-200 text-left font-bold text-slate-600">
                        <th className="border-r border-slate-200 px-3 py-2 sticky bg-slate-50 z-20" style={{ width: '80px', minWidth: '80px', maxWidth: '80px', left: '0px' }}>KPI no</th>
                        <th className="border-r border-slate-200 px-3 py-2 sticky bg-slate-50 z-20" style={{ width: '400px', minWidth: '400px', maxWidth: '400px', left: '80px' }}>KPI</th>
                        <th className="border-r border-slate-200 px-3 py-2" style={{ width: '180px', minWidth: '180px', maxWidth: '180px' }}>Team</th>
                        <th className="border-r border-slate-200 px-3 py-2" style={{ width: '150px', minWidth: '150px', maxWidth: '150px' }}>Owner</th>
                        <th className="border-r border-slate-200 px-3 py-2" style={{ width: '150px', minWidth: '150px', maxWidth: '150px' }}>Drive</th>
                        <th className="border-r border-slate-200 px-3 py-2" style={{ width: '150px', minWidth: '150px', maxWidth: '150px' }}>Reporting To</th>
                        <th className="border-r border-slate-200 px-3 py-2" style={{ width: '80px', minWidth: '80px', maxWidth: '80px' }}>UOM</th>
                        <th className="border-r border-slate-200 px-3 py-2" style={{ width: '80px', minWidth: '80px', maxWidth: '80px' }}>UP/Down</th>
                        <th className="border-r border-slate-200 px-3 py-2" style={{ width: '100px', minWidth: '100px', maxWidth: '100px' }}>CY Target</th>
                        {["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"].map(m => (
                          <th key={m} className="border-r border-slate-200 px-2 py-2 text-center" style={{ width: '100px', minWidth: '100px', maxWidth: '100px' }}>{m}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-sans">
                      {kpis.map((kpi, idx) => {
                        return (
                          <tr key={kpi.id} className="hover:bg-slate-50/50">
                            {/* A: KPI no */}
                            <td className="border-r border-slate-200 px-3 py-2 font-mono text-slate-500 sticky bg-white z-10" style={{ width: '80px', minWidth: '80px', maxWidth: '80px', left: '0px' }}>{idx + 1}</td>
                            
                            {/* B: KPI name */}
                            <td className="border-r border-slate-200 px-2 py-1.5 font-medium text-slate-800 sticky bg-white z-10" style={{ width: '400px', minWidth: '400px', maxWidth: '400px', left: '80px' }}>
                              {isEditingGrid ? (
                                <input 
                                  value={kpi.name}
                                  onChange={(e) => handleExcelCellChange(kpi, "name", e.target.value)}
                                  className="w-full border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-teal-400 bg-white"
                                />
                              ) : (
                                <div className="truncate max-w-xs px-1" title={kpi.name}>{kpi.name}</div>
                              )}
                            </td>

                            {/* C: Team */}
                            <td className="border-r border-slate-200 px-2 py-1.5 text-slate-650" style={{ width: '180px', minWidth: '180px', maxWidth: '180px' }}>
                              {isEditingGrid ? (
                                <input 
                                  value={kpi.team}
                                  onChange={(e) => handleExcelCellChange(kpi, "team", e.target.value)}
                                  className="w-full border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-teal-400 bg-white"
                                />
                              ) : (
                                <span className="px-1">{kpi.team}</span>
                              )}
                            </td>

                            {/* D: Owner */}
                            <td className="border-r border-slate-200 px-2 py-1.5 text-slate-650" style={{ width: '150px', minWidth: '150px', maxWidth: '150px' }}>
                              {isEditingGrid ? (
                                <input 
                                  value={kpi.owner}
                                  onChange={(e) => handleExcelCellChange(kpi, "owner", e.target.value)}
                                  className="w-full border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-teal-400 bg-white"
                                />
                              ) : (
                                <span className="px-1">{kpi.owner}</span>
                              )}
                            </td>

                            {/* E: Drive */}
                            <td className="border-r border-slate-200 px-2 py-1.5 text-slate-650" style={{ width: '150px', minWidth: '150px', maxWidth: '150px' }}>
                              {isEditingGrid ? (
                                <input 
                                  value={kpi.driveBy || ""}
                                  onChange={(e) => handleExcelCellChange(kpi, "driveBy", e.target.value)}
                                  className="w-full border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-teal-400 bg-white"
                                />
                              ) : (
                                <span className="px-1">{kpi.driveBy || "-"}</span>
                              )}
                            </td>

                            {/* F: Reporting To */}
                            <td className="border-r border-slate-200 px-2 py-1.5 text-slate-650" style={{ width: '150px', minWidth: '150px', maxWidth: '150px' }}>
                              {isEditingGrid ? (
                                <input 
                                  value={kpi.monitorBy || ""}
                                  onChange={(e) => handleExcelCellChange(kpi, "monitorBy", e.target.value)}
                                  className="w-full border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-teal-400 bg-white"
                                />
                              ) : (
                                <span className="px-1">{kpi.monitorBy || "-"}</span>
                              )}
                            </td>

                            {/* G: UOM */}
                            <td className="border-r border-slate-200 px-2 py-1.5 font-semibold text-slate-500 text-center" style={{ width: '80px', minWidth: '80px', maxWidth: '80px' }}>
                              {isEditingGrid ? (
                                <input 
                                  value={kpi.unit.trim()}
                                  onChange={(e) => handleExcelCellChange(kpi, "unit", e.target.value)}
                                  className="w-full border border-slate-200 rounded px-1 py-1 text-xs focus:outline-none focus:border-teal-400 bg-white text-center"
                                />
                              ) : (
                                <span>{kpi.unit.trim()}</span>
                              )}
                            </td>

                            {/* H: UP/Down */}
                            <td className="border-r border-slate-200 px-2 py-1.5 text-center" style={{ width: '80px', minWidth: '80px', maxWidth: '80px' }}>
                              {isEditingGrid ? (
                                <select 
                                  value={kpi.direction}
                                  onChange={(e) => handleExcelCellChange(kpi, "direction", e.target.value)}
                                  className="w-full border border-slate-200 rounded px-1 py-1 text-xs focus:outline-none focus:border-teal-400 bg-white text-center font-medium"
                                >
                                  <option value="higher">UP</option>
                                  <option value="lower">Down</option>
                                </select>
                              ) : (
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${kpi.direction === "lower" ? "bg-orange-50 text-orange-600" : "bg-teal-50 text-teal-600"}`}>
                                  {kpi.direction === "lower" ? "Down" : "UP"}
                                </span>
                              )}
                            </td>

                            {/* I: CY Target */}
                            <td className="border-r border-slate-200 px-2 py-1.5 font-bold text-slate-800 text-right" style={{ width: '100px', minWidth: '100px', maxWidth: '100px' }}>
                              {isEditingGrid ? (
                                <input 
                                  type="number"
                                  value={kpi.target}
                                  onChange={(e) => handleExcelCellChange(kpi, "target", e.target.value)}
                                  className="w-full border border-slate-200 rounded px-1.5 py-1 text-xs focus:outline-none focus:border-teal-400 bg-white text-right font-mono"
                                />
                              ) : (
                                <span className="px-1">{kpi.target}</span>
                              )}
                            </td>

                            {/* J to U: Monthly target + actual cells */}
                            {["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"].map(m => {
                              const year = ["Jan", "Feb", "Mar"].includes(m) ? 2027 : 2026;
                              const monthKey = `${m} ${year}`;
                              const targetVal = kpi.monthlyAlloc?.[monthKey] || 0;
                              const actualVal = kpi.monthlyActual?.[monthKey] ?? "";
                              return (
                                <td key={m} className="border-r border-slate-200 px-2 py-1.5 text-center" style={{ width: '100px', minWidth: '100px', maxWidth: '100px' }}>
                                  <div className="flex flex-col gap-1 items-center justify-center">
                                    <div className="text-[10px] text-slate-400 flex items-center gap-1" title="Target">
                                      <span>T:</span>
                                      {isEditingGrid ? (
                                        <input 
                                          type="number"
                                          value={targetVal}
                                          onChange={(e) => handleExcelTargetChange(kpi, m, e.target.value)}
                                          className="w-16 text-center border border-slate-200 focus:border-teal-400 bg-white rounded px-0.5 py-0.2 text-[10px] focus:outline-none font-medium font-mono text-slate-650"
                                        />
                                      ) : (
                                        <span className="font-mono font-medium">{targetVal}</span>
                                      )}
                                    </div>
                                    <input 
                                      type="number"
                                      value={actualVal}
                                      placeholder="Act"
                                      onChange={(e) => handleExcelActualChange(kpi, m, e.target.value)}
                                      className="w-20 text-center border border-slate-200 hover:border-slate-350 focus:border-teal-400 focus:ring-1 focus:ring-teal-200 bg-white rounded px-1 py-0.5 text-xs focus:outline-none transition-colors font-medium font-mono text-teal-800"
                                    />
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                      {kpis.length === 0 && (
                        <tr>
                          <td colSpan={21} className="px-6 py-12 text-center text-slate-400 italic bg-slate-50/20">
                            No KPIs uploaded yet. Upload an Excel file containing your KPIs to see them in the spreadsheet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {detailKpi && (
        <KpiDetail kpi={detailKpi} onClose={() => setDetailId(null)} onLog={() => { setLoggingId(detailKpi.id); }} />
      )}
      {loggingKpi && (
        <LogValueModal kpi={loggingKpi} onClose={() => setLoggingId(null)} onSubmit={onLog} />
      )}
      {addKpiOpen && (
        <EditKpiModal 
          kpi={{
            name: "",
            description: "",
            unit: "Nos",
            direction: "higher",
            team: teams[0]?.name || "",
            owner: "",
            target: 0,
            monthlyAlloc: {},
            monthlyActual: {},
            weeklyAlloc: {},
            weeklyActual: {},
            dailyAlloc: {},
            dailyActual: {}
          }} 
          teams={teams} 
          sidebarMinimized={sidebarMinimized} 
          onClose={() => setAddKpiOpen(false)} 
          onAddVertical={onAddVertical} 
          onAddMember={onAddMember} 
          onSubmit={(newKpi) => {
            onAddKpi(newKpi);
            setAddKpiOpen(false);
          }} 
        />
      )}
      {addMemberOpen && (
        <AddPlayerModal teams={teams} defaultTeamId={activeTeamId} onClose={() => setAddMemberOpen(false)} onSubmit={(teamId, member) => onAddMember(teamId, member)} />
      )}
      {addVerticalOpen && (
        <AddTeamModal teams={teams} onClose={() => setAddVerticalOpen(false)} onSubmit={(vertical) => onAddVertical(vertical)} />
      )}
      {addProjectOpen && (
        <AddProjectModal teams={teams} kpis={kpis} onClose={() => setAddProjectOpen(false)} onSubmit={onAddProject} />
      )}
      {editingProject && (
        <AddProjectModal teams={teams} kpis={kpis} project={editingProject} onClose={() => setEditingProject(null)} onSubmit={onAddProject} />
      )}
      {editingKpi && (
        <EditKpiModal kpi={editingKpi} teams={teams} sidebarMinimized={sidebarMinimized} onClose={() => setEditingKpi(null)} onSubmit={onEditKpi} onAddVertical={onAddVertical} onAddMember={onAddMember} />
      )}
    </div>
  );
}

function StatCard({ icon: Icon, iconBg, iconColor, value, label }) {
  return (
    <div className="bg-white border border-orange-100 rounded-2xl p-4 flex items-center gap-3 flex-1">
      <div className={`h-11 w-11 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>
      <div>
        <p className="text-xl font-semibold text-slate-900" style={{ fontFamily: "Poppins, sans-serif" }}>{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}

/* ==================== EMPLOYEE APP (mobile) ==================== */

const EMP_NAV = [
  { id: "home", icon: Home },
  { id: "mykpis", icon: List },
  { id: "team", icon: Trophy },
  { id: "profile", icon: User },
];

const CURRENT_EMPLOYEE = "Anand Kumar";

function EmployeeApp({ kpis, onLog, teams }) {
  const [screen, setScreen] = useState("home");
  const [detailId, setDetailId] = useState(null);
  const [loggingId, setLoggingId] = useState(null);
  const [shift, setShift] = useState("Excellent");

  const myKpis = kpis.filter((k) => k.owner === CURRENT_EMPLOYEE);
  const detailKpi = kpis.find((k) => k.id === detailId);
  const loggingKpi = kpis.find((k) => k.id === loggingId);
  const myTeam = teams.find((t) => t.members.some((m) => m.name === CURRENT_EMPLOYEE));
  const teamKpis = kpis.filter((k) => k.team === myTeam?.name);
  const onTrackInTeam = teamKpis.filter((k) => getStatus(k) === "on-track").length;

  return (
    <div className="flex items-center justify-center sm:py-4 h-full w-full">
      <div
        className="w-full h-full sm:h-auto sm:max-w-sm bg-white sm:rounded-[2.5rem] sm:shadow-xl overflow-hidden sm:border sm:border-orange-100 flex flex-col sm:aspect-[9/16]"
      >
        <div className="flex-1 overflow-y-auto flex flex-col">

        {screen === "home" && (
          <>
            <div className="relative bg-gradient-to-b from-orange-100 to-orange-50 px-6 pt-10 sm:pt-8 pb-6 overflow-hidden">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 220" preserveAspectRatio="none">
                <circle cx="330" cy="40" r="34" className="fill-orange-200" opacity="0.7" />
                <path d="M0 160 Q100 120 200 155 T400 150 V220 H0 Z" className="fill-orange-200" opacity="0.6" />
                <path d="M0 190 Q120 165 220 185 T400 180 V220 H0 Z" className="fill-teal-100" opacity="0.8" />
              </svg>
              <div className="relative">
                <p className="text-sm font-medium text-orange-900/70" style={{ fontFamily: "Poppins, sans-serif" }}>Hello {CURRENT_EMPLOYEE.split(" ")[0]}!</p>
                <h1 className="text-2xl font-semibold text-orange-950 mt-0.5" style={{ fontFamily: "Poppins, sans-serif" }}>Have a good shift!</h1>
                {myKpis[0] && (
                  <button onClick={() => setLoggingId(myKpis[0].id)} className="mt-6 bg-white/90 backdrop-blur rounded-2xl p-3 flex items-center gap-3 shadow-sm w-full text-left">
                    <div className="h-11 w-11 rounded-xl bg-teal-400 flex items-center justify-center shrink-0">
                      <Play className="h-4 w-4 text-white fill-white" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Today's update needed</p>
                      <p className="text-sm font-semibold text-slate-900">Log {myKpis[0].name}</p>
                    </div>
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-t-[2rem] -mt-4 relative px-5 pt-6 pb-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-slate-900" style={{ fontFamily: "Poppins, sans-serif" }}>My KPIs</h2>
                <button onClick={() => setScreen("mykpis")} className="text-xs font-medium text-teal-600 flex items-center">
                  View all <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 mb-6 -mx-5 px-5">
                {myKpis.map((kpi) => {
                  const status = getStatus(kpi);
                  const tint = status === "on-track" ? "bg-teal-100" : status === "at-risk" ? "bg-orange-100" : "bg-rose-100";
                  const bar = status === "on-track" ? "bg-teal-400" : status === "at-risk" ? "bg-orange-400" : "bg-rose-400";
                  return (
                    <button key={kpi.id} onClick={() => setDetailId(kpi.id)} className={`shrink-0 w-36 rounded-2xl p-4 text-left ${tint}`}>
                      <p className="text-xs font-medium text-slate-600 mb-2">{kpi.name}</p>
                      <p className="text-lg font-semibold text-slate-900 mb-2">{getLatest(kpi)}{kpi.unit}</p>
                      <div className="h-1.5 rounded-full bg-white/70 overflow-hidden mb-1">
                        <div className={`h-full rounded-full ${bar}`} style={{ width: `${progressPct(kpi)}%` }} />
                      </div>
                      <p className="text-[10px] text-slate-500">Target {kpi.target}{kpi.unit}</p>
                    </button>
                );
            })}
              </div>

              <button onClick={() => setScreen("team")} className="w-full flex items-center gap-3 bg-orange-50 rounded-2xl p-3.5 mb-6">
                <div className="h-10 w-10 rounded-xl bg-orange-300 flex items-center justify-center shrink-0">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-slate-900">{myTeam?.name}</p>
                  <p className="text-xs text-slate-500">{onTrackInTeam}/{teamKpis.length} KPIs on track</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>

              <div className="bg-white border border-slate-100 rounded-2xl p-4 mb-4">
                <p className="text-sm font-semibold text-slate-900 text-center mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>How did the shift go?</p>
                <p className="text-xs text-slate-400 text-center mb-4">Quick pulse check</p>
                <div className="flex justify-center mb-3">
                  <span className="px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 text-sm font-medium">{shift}</span>
                </div>
                <div className="flex justify-between gap-1.5">
                  {["Poor", "Fair", "Good", "Great", "Excellent"].map((opt) => (
                    <button key={opt} onClick={() => setShift(opt)} className={`flex-1 h-10 rounded-xl flex items-center justify-center text-xs font-medium border transition-colors ${shift === opt ? "bg-orange-400 border-orange-400 text-white" : "bg-orange-50 border-transparent text-orange-400"}`}>
                      {opt[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {screen === "mykpis" && (
          <div className="bg-white min-h-full flex-1 px-5 pt-6 pb-4">
            <div className="flex items-center gap-3 mb-5">
              <button onClick={() => setScreen("home")} className="text-slate-500"><ChevronLeft className="h-5 w-5" /></button>
              <h2 className="text-lg font-semibold text-slate-900" style={{ fontFamily: "Poppins, sans-serif" }}>My KPIs</h2>
            </div>
            <div className="space-y-3">
              {myKpis.map((kpi) => (
                <button key={kpi.id} onClick={() => setDetailId(kpi.id)} className="w-full bg-orange-50 rounded-2xl p-4 text-left">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-slate-900">{kpi.name}</p>
                    <StatusBadge status={getStatus(kpi)} />
                  </div>
                  <p className="text-xl font-semibold text-slate-900">{getLatest(kpi)}<span className="text-sm text-slate-400 ml-1">{kpi.unit}</span></p>
                  <p className="text-xs text-slate-400 mt-1">Target {kpi.target}{kpi.unit}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {screen === "team" && (
          <div className="bg-white min-h-full flex-1 px-5 pt-6 pb-4">
            <div className="flex items-center gap-3 mb-5">
              <button onClick={() => setScreen("home")} className="text-slate-500"><ChevronLeft className="h-5 w-5" /></button>
              <h2 className="text-lg font-semibold text-slate-900" style={{ fontFamily: "Poppins, sans-serif" }}>{myTeam?.name}</h2>
            </div>
            <p className="text-xs text-slate-400 mb-4">{myTeam?.members.map((m) => m.name).join(", ")}</p>
            <div className="space-y-3">
              {teamKpis.map((kpi) => (
                <button key={kpi.id} onClick={() => setDetailId(kpi.id)} className="w-full bg-orange-50 rounded-2xl p-4 text-left flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{kpi.name}</p>
                    <p className="text-xs text-slate-400">
                      {kpi.owner}
                      {(() => {
                        const allMembers = teams.flatMap(t => t.members);
                        const member = allMembers.find(m => m.name === kpi.owner);
                        return member && member.reportingManager ? ` (Reporting to: ${member.reportingManager})` : "";
                      })()}
                    </p>
                  </div>
                  <StatusBadge status={getStatus(kpi)} />
                </button>
              ))}
            </div>
          </div>
        )}

        {screen === "profile" && (
          <div className="bg-white min-h-full flex-1 px-5 pt-6 pb-4">
            <div className="flex flex-col items-center pt-4 pb-6">
              <div className="h-16 w-16 rounded-full bg-orange-200 flex items-center justify-center text-lg font-medium text-orange-800 mb-3">AR</div>
              <p className="font-semibold text-slate-900" style={{ fontFamily: "Poppins, sans-serif" }}>{CURRENT_EMPLOYEE}</p>
              <p className="text-xs text-slate-400">{myTeam?.name} · BULL Machines</p>
            </div>
            <div className="space-y-2">
              {myKpis.map((kpi) => (
                <div key={kpi.id} className="flex items-center justify-between bg-orange-50 rounded-xl px-4 py-3">
                  <span className="text-sm text-slate-700">{kpi.name}</span>
                  <StatusBadge status={getStatus(kpi)} />
                </div>
              ))}
            </div>
          </div>
        )}

        </div>

        <div className="bg-white border-t border-slate-100 px-8 py-3 flex items-center justify-between shrink-0">
          {EMP_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = screen === item.id;
            return (
              <button key={item.id} onClick={() => setScreen(item.id)} className={isActive ? "text-teal-600" : "text-slate-300"}>
                <Icon className="h-5 w-5" />
              </button>
          );
      })}
        </div>
      </div>

      {detailKpi && (
        <KpiDetail kpi={detailKpi} onClose={() => setDetailId(null)} onLog={() => setLoggingId(detailKpi.id)} />
      )}
      {loggingKpi && (
        <LogValueModal kpi={loggingKpi} onClose={() => setLoggingId(null)} onSubmit={onLog} />
      )}
    </div>
  );
}

/* ==================== ROOT APP ==================== */

export default function App() {
  const [kpis, setKpis] = useState([]);
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [role, setRole] = useState("admin");
  const [loading, setLoading] = useState(true);

  // Load from Supabase on mount, seed if empty
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        // Fetch Teams
        let { data: dbTeams, error: teamsError } = await supabase.from('teams').select('*');
        let { data: dbMembers, error: membersError } = await supabase.from('team_members').select('*');

        if (teamsError || membersError || !dbTeams || dbTeams.length === 0) {
          console.log("Supabase empty or error, seeding teams...");
          const seededTeams = [];
          for (const t of teamsData) {
            const { data: teamRow } = await supabase.from('teams').insert({
              name: t.name,
              description: t.description,
              lead: t.lead
            }).select().single();
            
            if (teamRow) {
              const membersToInsert = t.members.map(m => ({
                team_id: teamRow.id,
                name: m.name,
                employee_id: m.employeeId,
                designation: m.designation,
                experience: m.experience,
                reporting_manager: m.reportingManager,
                description: m.description
              }));
              const { data: memberRows } = await supabase.from('team_members').insert(membersToInsert).select();
              seededTeams.push({
                ...teamRow,
                members: memberRows.map(mr => ({
                  id: mr.id,
                  name: mr.name,
                  employeeId: mr.employee_id,
                  designation: mr.designation,
                  experience: mr.experience,
                  reportingManager: mr.reporting_manager,
                  description: mr.description
                }))
              });
            }
          }
          setTeams(seededTeams);
        } else {
          const loadedTeams = dbTeams.map(t => ({
            id: t.id,
            name: t.name,
            description: t.description,
            lead: t.lead,
            members: (dbMembers || []).filter(m => m.team_id === t.id).map(m => ({
              id: m.id,
              name: m.name,
              employeeId: m.employee_id,
              designation: m.designation,
              experience: m.experience,
              reportingManager: m.reporting_manager,
              description: m.description
            }))
          }));
          setTeams(loadedTeams);
        }

        // Fetch KPIs
        let { data: dbKpis, error: kpisError } = await supabase.from('kpis').select('*');
        if (kpisError) {
          console.error("Error fetching KPIs from Supabase:", kpisError);
        } else if (!dbKpis || dbKpis.length === 0) {
          console.log("No KPIs found in Supabase.");
          setKpis([]);
        } else {
          setKpis(dbKpis.map(k => ({
            id: k.id,
            name: k.name,
            unit: k.unit,
            target: parseFloat(k.target),
            direction: k.direction,
            team: k.team,
            owner: k.owner,
            driveBy: k.drive_by || "",
            monitorBy: k.monitor_by || "",
            description: k.description || "",
            kra: k.kra,
            history: k.history || [],
            dailyActual: k.daily_actual || {},
            revisedAlloc: k.revised_alloc || {},
            customHolidays: k.custom_holidays || {},
            holidaysEnabled: k.holidays_enabled,
            targetType: k.target_type,
            targetsList: k.targets_list,
            monthlyAlloc: k.monthly_alloc || {},
            monthlyActual: k.monthly_actual || {},
            weeklyAlloc: k.weekly_alloc || {},
            weeklyActual: k.weekly_actual || {},
            dailyAlloc: k.daily_alloc || {}
          })));
        }

        // Fetch Projects
        let { data: dbProjects, error: projectsError } = await supabase.from('projects').select('*');
        
        const mapDbProjectToUi = (p) => {
          let resultAndImprovement = p.description || "";
          let linkedKpiIds = [];
          let memberNames = [p.lead];
          let targetDate = "";
          if (p.stages && p.stages.length > 0) {
            targetDate = p.stages[p.stages.length - 1].targetDate || "";
          }

          try {
            const parsed = JSON.parse(p.description);
            if (parsed && typeof parsed === "object") {
              resultAndImprovement = parsed.resultAndImprovement || "";
              linkedKpiIds = parsed.linkedKpiIds || (parsed.linkedKpiId ? [parsed.linkedKpiId] : []);
              memberNames = parsed.memberNames || [p.lead];
              targetDate = parsed.targetDate || targetDate;
            }
          } catch (e) {
            // Not JSON
          }

          return {
            id: p.id,
            title: p.name,
            resultAndImprovement,
            linkedKpiIds,
            leadName: p.lead,
            memberNames,
            targetDate,
            team: p.team,
            stages: p.stages || [],
            currentStageIdx: p.current_stage_idx || 0
          };
        };

        if (projectsError) {
          console.error("Error fetching projects from Supabase:", projectsError);
        } else if (!dbProjects || dbProjects.length === 0) {
          console.log("No projects found in Supabase.");
          setProjects([]);
        } else {
          setProjects(dbProjects.map(mapDbProjectToUi));
        }
      } catch (err) {
        console.error("Error loading data from Supabase:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  async function handleLog(kpiId, value) {
    let updatedHistory = [];
    setKpis((prev) => prev.map((k) => {
      if (k.id !== kpiId) return k;
      const nextIndex = k.history.length + 1;
      updatedHistory = [...k.history, { d: `W${nextIndex}`, v: value }];
      return { ...k, history: updatedHistory };
    }));
    await supabase.from('kpis').update({ history: updatedHistory }).eq('id', kpiId);
  }

  async function handleAddMember(teamId, member) {
    const { data: memberRow } = await supabase.from('team_members').insert({
      team_id: teamId,
      name: member.name,
      employee_id: member.employeeId,
      designation: member.designation,
      experience: member.experience,
      reporting_manager: member.reportingManager,
      description: member.description
    }).select().single();

    if (memberRow) {
      const formattedMember = {
        id: memberRow.id,
        name: memberRow.name,
        employeeId: memberRow.employee_id,
        designation: memberRow.designation,
        experience: memberRow.experience,
        reportingManager: memberRow.reporting_manager,
        description: memberRow.description
      };
      setTeams((prev) => prev.map((t) => t.id === teamId ? { ...t, members: [...t.members, formattedMember] } : t));
    }
  }

  async function handleAddVertical(newVertical) {
    const { data: teamRow } = await supabase.from('teams').insert({
      name: newVertical.name,
      description: newVertical.description,
      lead: newVertical.lead
    }).select().single();

    if (teamRow) {
      const formattedTeam = {
        id: teamRow.id,
        name: teamRow.name,
        description: teamRow.description,
        lead: teamRow.lead,
        members: []
      };
      setTeams((prev) => [...prev, formattedTeam]);
    }
  }

  async function handleAddKpi(newKpi) {
    const targetType = newKpi.targetType || "monthly";
    const targetsList = newKpi.targetsList || [
      { id: "1", label: "CY Target", targetValue: newKpi.target, targetDate: "2026-08-31" }
    ];

    const { data: kpiRow } = await supabase.from('kpis').insert({
      name: newKpi.name,
      unit: newKpi.unit,
      target: newKpi.target,
      direction: newKpi.direction,
      team: newKpi.team,
      owner: newKpi.owner,
      drive_by: newKpi.driveBy || "",
      monitor_by: newKpi.monitorBy || "",
      description: newKpi.description || "",
      kra: newKpi.kra,
      history: newKpi.history || [],
      daily_actual: newKpi.dailyActual || {},
      revised_alloc: newKpi.revisedAlloc || {},
      custom_holidays: newKpi.customHolidays || {},
      holidays_enabled: newKpi.holidaysEnabled !== false,
      target_type: targetType,
      targets_list: targetsList,
      monthly_alloc: newKpi.monthlyAlloc || {},
      monthly_actual: newKpi.monthlyActual || {},
      weekly_alloc: newKpi.weeklyAlloc || {},
      weekly_actual: newKpi.weeklyActual || {},
      daily_alloc: newKpi.dailyAlloc || {}
    }).select().single();

    if (kpiRow) {
      const formattedKpi = {
        id: kpiRow.id,
        name: kpiRow.name,
        unit: kpiRow.unit,
        target: parseFloat(kpiRow.target),
        direction: kpiRow.direction,
        team: kpiRow.team,
        owner: kpiRow.owner,
        driveBy: kpiRow.drive_by || "",
        monitorBy: kpiRow.monitor_by || "",
        description: kpiRow.description || "",
        kra: kpiRow.kra,
        history: kpiRow.history || [],
        dailyActual: kpiRow.daily_actual || {},
        revisedAlloc: kpiRow.revised_alloc || {},
        customHolidays: kpiRow.custom_holidays || {},
        holidaysEnabled: kpiRow.holidays_enabled,
        targetType: kpiRow.target_type,
        targetsList: kpiRow.targets_list,
        monthlyAlloc: kpiRow.monthly_alloc || {},
        monthlyActual: kpiRow.monthly_actual || {},
        weeklyAlloc: kpiRow.weekly_alloc || {},
        weeklyActual: kpiRow.weekly_actual || {},
        dailyAlloc: kpiRow.daily_alloc || {}
      };
      setKpis((prev) => [...prev, formattedKpi]);
    }
  }

  async function handleEditKpi(updatedKpi) {
    setKpis((prev) => prev.map((k) => k.id === updatedKpi.id ? updatedKpi : k));
    await supabase.from('kpis').update({
      name: updatedKpi.name,
      unit: updatedKpi.unit,
      target: updatedKpi.target,
      direction: updatedKpi.direction,
      team: updatedKpi.team,
      owner: updatedKpi.owner,
      drive_by: updatedKpi.driveBy || "",
      monitor_by: updatedKpi.monitorBy || "",
      description: updatedKpi.description || "",
      kra: updatedKpi.kra,
      history: updatedKpi.history || [],
      daily_actual: updatedKpi.dailyActual || {},
      revised_alloc: updatedKpi.revisedAlloc || {},
      custom_holidays: updatedKpi.customHolidays || {},
      holidays_enabled: updatedKpi.holidaysEnabled !== false,
      target_type: updatedKpi.targetType,
      targets_list: updatedKpi.targetsList,
      monthly_alloc: updatedKpi.monthlyAlloc || {},
      monthly_actual: updatedKpi.monthlyActual || {},
      weekly_alloc: updatedKpi.weeklyAlloc || {},
      weekly_actual: updatedKpi.weeklyActual || {},
      daily_alloc: updatedKpi.dailyAlloc || {}
    }).eq('id', updatedKpi.id);
  }

  async function handleDeleteKpi(id) {
    if (window.confirm("Are you sure you want to delete this KPI? This action cannot be undone.")) {
      setKpis((prev) => prev.filter((k) => k.id !== id));
      await supabase.from('kpis').delete().eq('id', id);
    }
  }

  async function handleAddProject(newProject) {
    const isNew = typeof newProject.id === "string" && newProject.id.startsWith("temp-");
    
    const descriptionJson = JSON.stringify({
      resultAndImprovement: newProject.resultAndImprovement,
      linkedKpiIds: newProject.linkedKpiIds || [],
      memberNames: newProject.memberNames,
      targetDate: newProject.targetDate
    });

    let teamName = newProject.team || "Digital Marketing";
    if (!newProject.team && newProject.leadName) {
      const leadTeam = teams.find(t => t.members.some(m => m.name === newProject.leadName));
      if (leadTeam) teamName = leadTeam.name;
    }

    const dbPayload = {
      name: newProject.title,
      description: descriptionJson,
      team: teamName,
      lead: newProject.leadName,
      stages: newProject.stages || [],
      current_stage_idx: newProject.currentStageIdx || 0
    };

    if (isNew) {
      const { data: projectRow } = await supabase.from('projects').insert(dbPayload).select().single();

      if (projectRow) {
        setProjects((prev) => [...prev.filter(p => p.id !== newProject.id), {
          id: projectRow.id,
          title: projectRow.name,
          resultAndImprovement: newProject.resultAndImprovement,
          linkedKpiIds: newProject.linkedKpiIds || [],
          leadName: projectRow.lead,
          memberNames: newProject.memberNames,
          targetDate: newProject.targetDate,
          team: projectRow.team,
          stages: projectRow.stages || [],
          currentStageIdx: projectRow.current_stage_idx
        }]);
      }
    } else {
      setProjects((prev) => prev.map(p => p.id === newProject.id ? { ...p, ...newProject, team: teamName } : p));
      const { error } = await supabase.from('projects').update(dbPayload).eq('id', newProject.id);
      if (error) {
        console.error("Error updating project in Supabase:", error);
      }
    }
  }

  async function handleUpdateProjectStage(projectId, stageIdx, status) {
    let updatedStages = [];
    setProjects((prev) => prev.map((proj) => {
      if (proj.id !== projectId) return proj;
      updatedStages = proj.stages.map((stage, idx) => {
        if (idx === stageIdx) return { ...stage, status };
        if (status === "current" && stage.status === "current") {
          return { ...stage, status: idx < stageIdx ? "completed" : "pending" };
        }
        return stage;
      });
      return { ...proj, stages: updatedStages, currentStageIdx: stageIdx };
    }));

    await supabase.from('projects').update({
      stages: updatedStages,
      current_stage_idx: stageIdx
    }).eq('id', projectId);
  }

  async function handleDeleteProject(id) {
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) {
        console.error("Error deleting project from Supabase:", error);
      }
    }
  }

  async function handleUploadKpis(kpisToUpload, metadata) {
    const { team, owner, driveBy, monitorBy, useRowMetadata } = metadata || {};
    const mapped = kpisToUpload.map(k => ({
      name: k.name || "Unnamed KPI",
      unit: k.unit || " Nos",
      target: parseFloat(k.target) || 0.0,
      direction: k.direction || "higher",
      team: useRowMetadata ? (k.team || "Digital Marketing") : (team || "Digital Marketing"),
      owner: useRowMetadata ? (k.owner || "Anand Kumar") : (owner || "Anand Kumar"),
      drive_by: useRowMetadata ? (k.driveBy || "") : (driveBy || ""),
      monitor_by: useRowMetadata ? (k.monitorBy || "") : (monitorBy || ""),
      kra: k.kra || "",
      description: k.description || "",
      history: k.history || [],
      daily_actual: k.dailyActual || k.daily_actual || {},
      revised_alloc: k.revisedAlloc || k.revised_alloc || {},
      custom_holidays: k.customHolidays || k.custom_holidays || {},
      holidays_enabled: k.holidaysEnabled !== false,
      target_type: k.targetType || k.target_type || "monthly",
      targets_list: k.targetsList || k.targets_list || [],
      monthly_alloc: k.monthlyAlloc || k.monthly_alloc || {},
      monthly_actual: k.monthlyActual || k.monthly_actual || {},
      weekly_alloc: k.weeklyAlloc || k.weekly_alloc || {},
      weekly_actual: k.weeklyActual || k.weekly_actual || {},
      daily_alloc: k.dailyAlloc || k.daily_alloc || {}
    }));

    const { data, error } = await supabase.from('kpis').insert(mapped).select();
    if (error) {
      alert("Error inserting KPIs: " + error.message);
      console.error(error);
    } else if (data) {
      const mappedData = data.map(k => ({
        id: k.id,
        name: k.name,
        unit: k.unit,
        target: parseFloat(k.target),
        direction: k.direction,
        team: k.team,
        owner: k.owner,
        driveBy: k.drive_by || "",
        monitorBy: k.monitor_by || "",
        description: k.description || "",
        kra: k.kra,
        history: k.history || [],
        dailyActual: k.daily_actual || {},
        revisedAlloc: k.revised_alloc || {},
        customHolidays: k.custom_holidays || {},
        holidaysEnabled: k.holidays_enabled,
        targetType: k.target_type,
        targetsList: k.targets_list,
        monthlyAlloc: k.monthly_alloc || {},
        monthlyActual: k.monthly_actual || {},
        weeklyAlloc: k.weekly_alloc || {},
        weeklyActual: k.weekly_actual || {},
        dailyAlloc: k.daily_alloc || {}
      }));
      setKpis(prev => [...prev, ...mappedData]);
      alert(`Successfully uploaded ${mappedData.length} KPIs!`);
    }
  }

  if (loading) {
    return (
      <div className="h-screen w-screen bg-orange-50 flex items-center justify-center flex-col gap-3">
        <div className="h-10 w-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-teal-800">Syncing with Supabase...</p>
      </div>
    );
  }
  return (
    <div className="h-screen w-screen bg-orange-50 sm:p-4 flex flex-col overflow-hidden relative" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <div className="absolute top-4 right-4 z-50 hidden sm:flex items-center gap-1 bg-white border border-orange-200 rounded-full p-1 shadow-sm">
        <button
          onClick={() => setRole("employee")}
          title="Employee View (Mobile)"
          className={`p-2 rounded-full transition-colors ${role === "employee" ? "bg-teal-500 text-white" : "text-slate-500 hover:bg-orange-50"}`}
        >
          <Smartphone className="h-4 w-4" />
        </button>
        <button
          onClick={() => setRole("admin")}
          title="Admin View (Desktop)"
          className={`p-2 rounded-full transition-colors ${role === "admin" ? "bg-teal-500 text-white" : "text-slate-500 hover:bg-orange-50"}`}
        >
          <Monitor className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 w-full h-full flex flex-col min-h-0">
        {role === "admin" ? (
          <AdminApp 
            kpis={kpis} 
            onLog={handleLog} 
            teams={teams} 
            onAddMember={handleAddMember} 
            onAddVertical={handleAddVertical} 
            onAddKpi={handleAddKpi} 
            projects={projects}
            onAddProject={handleAddProject}
            onUpdateProjectStage={handleUpdateProjectStage}
            onEditKpi={handleEditKpi}
            onDeleteKpi={handleDeleteKpi}
            onDeleteProject={handleDeleteProject}
            onUploadKpis={handleUploadKpis}
          />
        ) : (
          <EmployeeApp kpis={kpis} onLog={handleLog} teams={teams} />
        )}
      </div>
    </div>
  );
}
