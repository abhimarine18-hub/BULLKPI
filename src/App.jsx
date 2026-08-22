import React, { useState, useMemo, useEffect } from "react";
import { supabase } from "./supabaseClient";
import * as XLSX from "xlsx";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  LayoutDashboard, Target, TrendingUp, Users, Megaphone, Settings,
  Search, Plus, ChevronDown, ChevronUp, ChevronRight, ChevronLeft, MoreHorizontal, Circle,
  Star, Mountain, UserCheck, Play, Home, List, Trophy, User, X, Smartphone, Monitor,
  LayoutGrid, GitBranch, FolderGit2, CalendarRange, ListTodo, Clock, Pencil, Menu, Trash2, Table, Download, Copy, Coffee, LogOut, Calendar
} from "lucide-react";

export const MONTHS_LIST = ["Apr 2026", "May 2026", "Jun 2026", "Jul 2026", "Aug 2026", "Sep 2026", "Oct 2026", "Nov 2026", "Dec 2026", "Jan 2027", "Feb 2027", "Mar 2027"];

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

function getLatest(kpi) { 
  if (!kpi.history || kpi.history.length === 0) return 0;
  return kpi.history[kpi.history.length - 1].v || 0; 
}

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
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${s.bg} ${s.text}`}>
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
          <h3 className="font-semibold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Log {kpi.name}</h3>
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

function KpiDetail({ kpi, allKpis, onClose, onLog }) {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    const m = d.toLocaleString('en-US', { month: 'short' });
    const yr = ["Jan", "Feb", "Mar"].includes(m) ? "2027" : "2026";
    return `${m} ${yr}`;
  });

  const status = getStatus(kpi);
  const parentKpi = allKpis ? allKpis.find(k => String(k.reportConfig?.followUpKpiId) === String(kpi.id)) : null;

  const chartData = useMemo(() => {
    const days = getDaysInMonth(selectedMonth);
    return days.map(dStr => ({
      d: dStr.slice(-2), // just day number for X-Axis
      target: kpi.dailyAlloc?.[dStr] || 0,
      actual: kpi.dailyActual?.[dStr] || 0
    }));
  }, [selectedMonth, kpi.dailyAlloc, kpi.dailyActual]);

  const cells = useMemo(() => getCalendarCells(selectedMonth), [selectedMonth]);
  const numRows = Math.ceil(cells.length / 7);

  return (
    <div className="fixed inset-0 bg-slate-900/40 flex items-end md:items-center justify-center z-50 p-0 md:p-4">
      <div className="bg-white rounded-t-2xl md:rounded-2xl p-5 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>{kpi.name}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="h-5 w-5" /></button>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <StatusBadge status={status} />
          <span className="text-xs text-slate-400">
            {kpi.team} · {kpi.owner}
          </span>
        </div>
        
        {parentKpi && (() => {
          const parentStatus = getStatus(parentKpi);
          const isParentPending = parentStatus !== "on-track";
          return (
            <div className={`mb-4 rounded-xl p-3.5 border flex flex-col gap-3 shadow-sm ${isParentPending ? "bg-rose-50 border-rose-200" : "bg-teal-50 border-teal-200"}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1 ${isParentPending ? "text-rose-700" : "text-teal-700"}`}>
                    <GitBranch className="w-3 h-3" /> Triggered by Parent KPI
                  </p>
                  <p className={`text-sm font-semibold pr-2 ${isParentPending ? "text-rose-900" : "text-teal-900"}`}>{parentKpi.name}</p>
                </div>
                <div className={`text-right shrink-0 px-3 py-1.5 rounded-lg border bg-white/60 ${isParentPending ? "border-rose-100" : "border-teal-100"}`}>
                  <p className={`text-lg font-bold ${isParentPending ? "text-rose-600" : "text-teal-600"}`}>{parentKpi.target}<span className={`text-[10px] ml-0.5 font-semibold ${isParentPending ? "text-rose-500" : "text-teal-500"}`}>{parentKpi.unit}</span></p>
                  <p className={`text-[9px] uppercase font-bold tracking-wide ${isParentPending ? "text-rose-500/80" : "text-teal-500/80"}`}>Parent Target</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${isParentPending ? "bg-rose-200 text-rose-800" : "bg-teal-200 text-teal-800"}`}>
                  Parent Status: {parentStatus === "on-track" ? "Completed" : "Pending"}
                </span>
                {isParentPending && (
                  <span className="text-[11px] font-bold text-rose-600 animate-pulse flex items-center gap-1">
                     ⚠️ Raise for Followup!
                  </span>
                )}
              </div>
            </div>
          );
        })()}

        <div className="flex items-end gap-4 mb-2">
          <div>
            <p className="text-2xl font-semibold text-slate-900">{getLatest(kpi)}{kpi.unit}</p>
            <p className="text-xs text-slate-400">{parentKpi ? 'Child Actual' : 'Current actual (Year)'}</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-slate-400">{kpi.target}{kpi.unit}</p>
            <p className="text-xs text-slate-400">{parentKpi ? 'Child Target' : 'Target (Year)'}</p>
          </div>
        </div>

        {/* Month selector for the detailed view */}
        <div className="flex items-center justify-between mt-3 mb-4 border-b border-slate-100 pb-2">
          <div className="flex space-x-1 overflow-x-auto pb-1 scrollbar-hide">
            {MONTHS_LIST.map(m => (
              <button
                key={m}
                onClick={() => setSelectedMonth(m)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors ${
                  selectedMonth === m ? "bg-teal-500 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Date wise chart */}
        <div className="h-40 mb-5">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#fdf1e8" vertical={false} />
              <XAxis dataKey="d" tick={{ fontSize: 10, fill: "#c4917a" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#c4917a" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #fde3d3" }} />
              <Line type="monotone" dataKey="target" name="Target" stroke="#cbd5e1" strokeDasharray="3 3" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="actual" name="Actual" stroke="#f97316" strokeWidth={2} dot={{ r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Calendar View */}
        <div className="mb-4 pt-3 border-t border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Target Schedule (Daily) - {selectedMonth}
          </p>
          <div className="bg-slate-50/50 p-2 rounded-xl border border-slate-100/80 overflow-x-auto">
            <div className="min-w-[360px]">
              <div className="grid grid-cols-7 gap-1 text-center mb-1 text-[9px] font-bold text-slate-400">
                <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
              </div>
              <div className="space-y-1">
                {Array.from({ length: numRows }).map((_, r) => {
                  const rowCells = cells.slice(r * 7, (r + 1) * 7);
                  return (
                    <div key={r} className="grid grid-cols-7 gap-1 items-center">
                      {rowCells.map((cell, cIdx) => {
                        if (!cell || cell.isEmpty) {
                          return <div key={`empty-${r}-${cIdx}`} className="bg-slate-100/30 rounded h-11 border border-dashed border-slate-200/60" />;
                        }
                        const dayTarget = kpi.dailyAlloc?.[cell.dateStr] || 0;
                        const dayActual = kpi.dailyActual?.[cell.dateStr] || 0;
                        const check = checkIsHolidayPure(cell.dateStr, kpi.holidaysEnabled ?? true, kpi.customHolidays || {});
                        
                        let cellBg = check.isHoliday ? "bg-rose-50/30 border-rose-100/50" : "bg-white border-slate-200/80 shadow-sm";
                        if (!check.isHoliday && dayTarget > 0) {
                          cellBg = "bg-teal-50/30 border-teal-200/80 ring-1 ring-teal-50 shadow-sm";
                        }

                        return (
                          <div key={cell.dateStr} className={`border rounded-[6px] p-1 text-center flex flex-col justify-between h-11 ${cellBg} transition-colors hover:border-slate-300`}>
                            <div className={`text-[9px] font-extrabold text-left leading-none ${dayTarget > 0 ? 'text-teal-800' : 'text-slate-500'}`}>{cell.dayNum}</div>
                            <div className="flex justify-between items-end mt-auto">
                              <span className={`text-[8.5px] font-bold ${dayTarget > 0 ? 'text-teal-700' : 'text-slate-400'}`} title="Target">T:{formatIndianNumber(dayTarget) || 0}</span>
                              <span className={`text-[8.5px] font-extrabold ${dayActual > 0 ? 'text-emerald-600' : 'text-slate-300'}`} title="Actual">A:{formatIndianNumber(dayActual) || 0}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {kpi.kpiType !== 'report' && (
          <button
            onClick={onLog}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-2.5 rounded-xl transition-colors mt-2"
          >
            Log new value
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------------- Add member / Add vertical modals (shared) ---------------- */

/* ---------------- Add KPI modal (shared) ---------------- */



function ExcelColumnMapModal({ modal, onClose, onConfirm }) {
  const { headers, allHeaders, rows, headerIdx } = modal;
  const FIELDS = [
    { key: "kpi",       label: "KPI Name",      required: true },
    { key: "empId",     label: "Employee ID",    required: false },
    { key: "team",      label: "Team / Dept",    required: false },
    { key: "owner",     label: "Owner (DO)",     required: false },
    { key: "drive",     label: "Drive By",       required: false },
    { key: "monitor",   label: "Monitor By",     required: false },
    { key: "uom",       label: "Unit (UOM)",     required: false },
    { key: "direction", label: "UP/Down",        required: false },
    { key: "target",    label: "CY Target",      required: false },
  ];
  const MONTHS = MONTHS_LIST;

  // Auto-detect sensible defaults from header names
  const autoDetect = (label) => {
    const lc = label.toLowerCase();
    const idx = allHeaders.findIndex(h => {
      const hl = h.toLowerCase();
      if (lc === "kpi name") return hl === "kpi" || hl === "kpi name";
      if (lc === "employee id") return hl.includes("emp") || hl.includes("employee id") || hl === "employee_id";
      if (lc === "team / dept") return hl === "team" || hl === "department";
      if (lc === "owner (do)") return hl === "do" || hl === "owner";
      if (lc === "drive by") return hl === "drive" || hl.includes("drive");
      if (lc === "monitor by") return hl === "monitor" || hl.includes("monitor") || hl === "reporting to";
      if (lc === "unit (uom)") return hl === "uom" || hl === "unit";
      if (lc === "up/down") return hl === "up/ down" || hl === "up/down" || hl === "direction";
      if (lc === "cy target") return hl === "cy target" || hl === "target";
      return false;
    });
    return idx !== -1 ? String(idx) : "";
  };

  const initMap = {};
  FIELDS.forEach(f => { initMap[f.key] = autoDetect(f.label); });
  MONTHS.forEach(m => {
    const idx = allHeaders.findIndex(h => h === m);
    initMap[`month_${m}`] = idx !== -1 ? String(idx) : "";
  });

  const [colMap, setColMap] = useState(initMap);
  const setCol = (key) => (e) => setColMap(prev => ({ ...prev, [key]: e.target.value }));

  const optionList = [<option key="" value="">— Not mapped —</option>, ...allHeaders.map((h, i) => (
    h.trim() !== "" ? <option key={i} value={String(i)}>{h}</option> : null
  ))];

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-start justify-center z-50 p-4 overflow-y-auto pt-8">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl">
        <div className="px-5 pt-5 pb-3 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-800 text-base" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Match Excel Columns</h2>
              <p className="text-xs text-slate-400 mt-0.5">Map your sheet's columns to the correct fields before importing.</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="h-4 w-4" /></button>
          </div>
        </div>

        <div className="px-5 py-4 space-y-3 max-h-[65vh] overflow-y-auto">
          {/* Core field mapping */}
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Core Fields</p>
          <div className="grid grid-cols-1 gap-2.5">
            {FIELDS.map(f => (
              <div key={f.key} className="flex items-center gap-3">
                <label className="text-xs font-semibold text-slate-600 w-32 shrink-0">
                  {f.label}{f.required && <span className="text-red-400 ml-0.5">*</span>}
                </label>
                <select
                  value={colMap[f.key]}
                  onChange={setCol(f.key)}
                  className="flex-1 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-200 bg-white"
                >
                  {optionList}
                </select>
              </div>
            ))}
          </div>

          {/* Monthly target columns */}
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2">Monthly Target Columns</p>
          <div className="grid grid-cols-2 gap-2">
            {MONTHS.map(m => (
              <div key={m} className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-600 w-10 shrink-0">{m}</label>
                <select
                  value={colMap[`month_${m}`]}
                  onChange={setCol(`month_${m}`)}
                  className="flex-1 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-200 bg-white"
                >
                  {optionList}
                </select>
              </div>
            ))}
          </div>
        </div>

        <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <p className="text-[10px] text-slate-400">{rows.length - headerIdx - 1} data rows detected in sheet.</p>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors">Cancel</button>
            <button
              onClick={() => {
                if (!colMap.kpi) { alert("Please map at least the KPI Name column."); return; }
                onConfirm(colMap, rows, headerIdx);
              }}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-500 hover:bg-teal-600 text-white transition-colors shadow-sm"
            >
              Import KPIs →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddPlayerModal({ teams, defaultTeamId, onClose, onSubmit }) {
  const [teamId, setTeamId] = useState(defaultTeamId || teams[0]?.id);
  const [form, setForm] = useState({ name: "", designation: "", experience: "", description: "", loginId: "", password: "" });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-5 w-full max-w-md max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Add Player</h3>
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">User ID (Login)</label>
              <input value={form.loginId} onChange={set("loginId")} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300" placeholder="e.g. neha_k" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Password</label>
              <input type="password" value={form.password} onChange={set("password")} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300" placeholder="e.g. 123" />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Description</label>
            <textarea value={form.description} onChange={set("description")} rows={2} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300" placeholder="What does this person own?" />
          </div>
        </div>
        <button
          onClick={() => { 
            if (!form.name) return; 
            const generatedEmpId = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
            onSubmit(teamId, { 
              ...form, 
              id: Date.now(), 
              employeeId: generatedEmpId, 
              experience: parseFloat(form.experience) || 0,
              loginId: form.loginId || generatedEmpId,
              password: form.password || "123"
            }); 
            onClose(); 
          }}
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
          <h3 className="font-semibold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Add Team</h3>
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
          <h3 className="font-semibold text-slate-900 text-base" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>{project ? "Edit Project" : "Add Project"}</h3>
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
  { name: "Apr 2026", year: 2026, monthIdx: 3 },
  { name: "May 2026", year: 2026, monthIdx: 4 },
  { name: "Jun 2026", year: 2026, monthIdx: 5 },
  { name: "Jul 2026", year: 2026, monthIdx: 6 },
  { name: "Aug 2026", year: 2026, monthIdx: 7 },
  { name: "Sep 2026", year: 2026, monthIdx: 8 },
  { name: "Oct 2026", year: 2026, monthIdx: 9 },
  { name: "Nov 2026", year: 2026, monthIdx: 10 },
  { name: "Dec 2026", year: 2026, monthIdx: 11 },
  { name: "Jan 2027", year: 2027, monthIdx: 0 },
  { name: "Feb 2027", year: 2027, monthIdx: 1 },
  { name: "Mar 2027", year: 2027, monthIdx: 2 }
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

const checkIsHolidayPure = (dateStr, holidaysEnabled, customHolidays, excludeSundays = true) => {
  if (!holidaysEnabled) return { isHoliday: false };
  if (customHolidays?.[dateStr]) {
    return { isHoliday: true, name: "Admin Holiday" };
  }
  const d = new Date(dateStr);
  if (excludeSundays && d.getDay() === 0) {
    return { isHoliday: true, name: "Sunday" };
  }
  return { isHoliday: false };
};

const distributeMonthToSubperiods = (monthName, monthVal, currentDaily, currentWeekly, holidaysEnabled, customHolidays, excludeSundays = true) => {
  const cells = getCalendarCells(monthName);
  const numRows = Math.ceil(cells.length / 7);

  const allWorkingDays = [];
  cells.forEach(cell => {
    if (cell && !cell.isEmpty) {
      if (!checkIsHolidayPure(cell.dateStr, holidaysEnabled, customHolidays, excludeSundays).isHoliday) {
        allWorkingDays.push(cell.dateStr);
      }
    }
  });

  const totalWorkingDays = allWorkingDays.length || 1;
  const baseDay = Math.floor(monthVal / totalWorkingDays);
  const remDay = monthVal - (baseDay * totalWorkingDays);

  // Evenly space the remainder days across the month:
  // Pick indices at regular intervals so no day is more than 1 apart from others.
  // e.g. remDay=10 out of 26 working days → every ~2.6th day gets +1
  const extraSet = new Set();
  if (remDay > 0) {
    const step = totalWorkingDays / remDay;
    for (let i = 0; i < remDay; i++) {
      const idx = Math.round(i * step + step / 2); // center-offset for better spread
      extraSet.add(Math.min(idx, totalWorkingDays - 1));
    }
    // If rounding caused collisions, fill remaining from the end
    let filled = extraSet.size;
    let probe = totalWorkingDays - 1;
    while (filled < remDay && probe >= 0) {
      if (!extraSet.has(probe)) { extraSet.add(probe); filled++; }
      probe--;
    }
  }

  const nextD = { ...currentDaily };

  cells.forEach(cell => {
    if (cell && !cell.isEmpty) {
      if (checkIsHolidayPure(cell.dateStr, holidaysEnabled, customHolidays, excludeSundays).isHoliday) {
        nextD[cell.dateStr] = 0;
      } else {
        const wdIdx = allWorkingDays.indexOf(cell.dateStr);
        nextD[cell.dateStr] = baseDay + (extraSet.has(wdIdx) ? 1 : 0);
      }
    }
  });

  const nextW = { ...currentWeekly };
  for (let r = 0; r < numRows; r++) {
    const weekDays = getDaysInWeekRow(monthName, r);
    const weekSum = weekDays.reduce((sum, d) => sum + (nextD[d] || 0), 0);
    nextW[`${monthName}-Week${r + 1}`] = weekSum;
  }

  return { nextW, nextD };
};


const distributeMonthActualToSubperiods = (monthName, monthVal, currentDailyAct, currentWeeklyAct, holidaysEnabled, customHolidays, excludeSundays = true) => {
  const cells = getCalendarCells(monthName);
  const numRows = Math.ceil(cells.length / 7);

  const allWorkingDays = [];
  cells.forEach(cell => {
    if (cell && !cell.isEmpty) {
      if (!checkIsHolidayPure(cell.dateStr, holidaysEnabled, customHolidays, excludeSundays).isHoliday) {
        allWorkingDays.push(cell.dateStr);
      }
    }
  });

  const totalWorkingDays = allWorkingDays.length || 1;
  const baseDay = Math.floor(monthVal / totalWorkingDays);
  let remDay = monthVal - (baseDay * totalWorkingDays);

  const nextDAct = { ...currentDailyAct };
  
  cells.forEach(cell => {
    if (cell && !cell.isEmpty) {
      if (checkIsHolidayPure(cell.dateStr, holidaysEnabled, customHolidays, excludeSundays).isHoliday) {
        nextDAct[cell.dateStr] = 0;
      } else {
        nextDAct[cell.dateStr] = baseDay + (remDay > 0 ? 1 : 0);
        if (remDay > 0) remDay--;
      }
    }
  });

  const nextWAct = { ...currentWeeklyAct };
  for (let r = 0; r < numRows; r++) {
    const weekDays = getDaysInWeekRow(monthName, r);
    const weekSum = weekDays.reduce((sum, d) => sum + (nextDAct[d] || 0), 0);
    nextWAct[`${monthName}-Week${r + 1}`] = weekSum;
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

const KpiCheckboxList = ({ kpis, selectedIds, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const toggleId = (id) => {
    const strId = id.toString();
    if (selectedIds.includes(strId)) {
      onChange(selectedIds.filter(x => x !== strId));
    } else {
      onChange([...selectedIds, strId]);
    }
  };

  const filteredKpis = kpis.filter(k => 
    k.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (k.owner && k.owner.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="border border-teal-200 rounded-lg bg-white shadow-inner flex flex-col mt-1 mb-2">
      <div className="p-2 border-b border-teal-100 bg-teal-50/30 rounded-t-lg shrink-0">
        <input 
          type="text" 
          placeholder="Search KPIs by name or owner..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-2 py-1.5 text-[11px] border border-teal-200 rounded focus:outline-none focus:ring-1 focus:ring-teal-400 bg-white placeholder-slate-400"
        />
      </div>
      <div className="max-h-40 overflow-y-auto divide-y divide-slate-50">
        {filteredKpis.map(k => (
          <label key={k.id} className="flex items-start gap-3 p-2 hover:bg-slate-50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={selectedIds.includes(k.id.toString()) || selectedIds.includes(k.id)}
              onChange={() => toggleId(k.id)}
              className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
            />
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-bold text-slate-700 truncate leading-tight">{k.name}</div>
              <div className="text-[9px] text-slate-400 truncate mt-0.5">{k.team} • {k.owner}</div>
            </div>
          </label>
        ))}
        {filteredKpis.length === 0 && (
          <div className="p-4 text-center text-xs text-slate-400 italic">No KPIs match your search</div>
        )}
      </div>
    </div>
  );
};

function EditKpiModal({ kpi, allKpis, teams, onClose, onSubmit, onAddVertical, onAddMember, sidebarMinimized }) {
  const parentKpi = (allKpis && kpi.id != null) ? allKpis.find(k => k.reportConfig?.followUpKpiId != null && String(k.reportConfig?.followUpKpiId) === String(kpi.id)) : null;
  const [kpiType, setKpiType] = useState(kpi.kpiType || 'activity');
  const [reportConfig, setReportConfig] = useState(kpi.reportConfig || { type: 'sum', kpiIds: [], numeratorIds: [], denominatorIds: [] });

  // Drive, Monitor, DO (owner) and Weightage configurations
  const [driveBy, setDriveBy] = useState(kpi.driveBy || "");
  const [monitorBy, setMonitorBy] = useState(kpi.monitorBy || "");
  const [weightage, setWeightage] = useState(kpi.weightage || 0);
  const [name, setName] = useState(kpi.name);
  const [description, setDescription] = useState(kpi.description || "");
  const [unit, setUnit] = useState(kpi.unit);
  const isTimeKpi = unit.trim().toLowerCase() === "time";
  const [distributeEnabled, setDistributeEnabled] = useState(kpi.targetType !== "monthly");
  const [handoffEnabled, setHandoffEnabled] = useState(kpi.reportConfig?.handoffEnabled || false);
  const [handoffMode, setHandoffMode] = useState(kpi.reportConfig?.handoffMode || "drive_social");
  const [parentLabel, setParentLabel] = useState(kpi.reportConfig?.parentLabel || "Google Drive Link");
  const [childLabel, setChildLabel] = useState(kpi.reportConfig?.childLabel || "Social Media Link");
  const [cutoffTime, setCutoffTime] = useState(kpi.reportConfig?.cutoffTime || "17:30");
  const [bufferMinutes, setBufferMinutes] = useState(kpi.reportConfig?.bufferMinutes || 30);
  
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
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    const m = d.toLocaleString('en-US', { month: 'short' });
    const yr = ["Jan", "Feb", "Mar"].includes(m) ? "2027" : "2026";
    return `${m} ${yr}`;
  });

  // Holiday & Leave States
  const [holidaysEnabled, setHolidaysEnabled] = useState(kpi.holidaysEnabled ?? true);
  const [excludeSundays, setExcludeSundays] = useState(() => {
    if (kpi.excludeSundays !== undefined) return kpi.excludeSundays;
    if (kpi.dailyAlloc) {
      for (const [dateStr, val] of Object.entries(kpi.dailyAlloc)) {
        if (val > 0 && new Date(dateStr).getDay() === 0) {
          return false;
        }
      }
    }
    return true;
  });


  const handleClearTargets = () => {
    if (window.confirm(`Clear all daily targets for ${selectedMonth} only?`)) {
      // Get all days in the selected month
      const monthDays = getDaysInMonth(selectedMonth);
      const numRows = Math.ceil(getCalendarCells(selectedMonth).length / 7);

      // Zero out only this month's daily entries, keep all other months intact
      setDailyAlloc(prev => {
        const next = { ...prev };
        monthDays.forEach(d => { next[d] = 0; });
        return next;
      });

      // Zero out only this month's weekly entries
      setWeeklyAlloc(prev => {
        const next = { ...prev };
        for (let r = 0; r < numRows; r++) {
          next[`${selectedMonth}-Week${r + 1}`] = 0;
        }
        return next;
      });

      // Zero out this month's allocation and recalculate total
      setMonthlyAlloc(prev => {
        const next = { ...prev, [selectedMonth]: 0 };
        const totalSum = Object.values(next).reduce((a, b) => a + b, 0);
        setTotalTargetInput(totalSum);
        return next;
      });
    }
  };


  const handleAutoDistribute = (overrides = {}) => {
    const effHolidays = overrides.customHolidays !== undefined ? overrides.customHolidays : customHolidays;
    const effExclude = overrides.excludeSundays !== undefined ? overrides.excludeSundays : excludeSundays;

    let nextW = { ...weeklyAlloc };
    let nextD = { ...dailyAlloc };

    MONTHS_LIST.forEach(m => {
      const val = monthlyAlloc[m] || 0;
      const subRes = distributeMonthToSubperiods(m, val, nextD, nextW, holidaysEnabled, effHolidays, effExclude);
      nextW = subRes.nextW;
      nextD = subRes.nextD;
    });

    setWeeklyAlloc(nextW);
    setDailyAlloc(nextD);
  };
  
  const [dailyLeave] = useState({});
  const [dailyPartialLeave] = useState({});

  // Monthly Allocation state
  const [monthlyAlloc, setMonthlyAlloc] = useState(() => {
    const defaultM = {};
    MONTHS_LIST.forEach(m => {
      defaultM[m] = kpi.monthlyAlloc?.[m] ?? Math.round(((kpi.target || 0) / 12) * 100) / 100;
    });
    return defaultM;
  });

  const [weeklyAlloc, setWeeklyAlloc] = useState(kpi.weeklyAlloc || {});
  const [dailyAlloc, setDailyAlloc] = useState(kpi.dailyAlloc || {});

  // For actuals & rollover tracking
  const [dailyActual] = useState(kpi.dailyActual || {});
  const [monthlyActual] = useState(kpi.monthlyActual || {});
  const [weeklyActual] = useState(kpi.weeklyActual || {});
  const [revisedAlloc, setRevisedAlloc] = useState(kpi.revisedAlloc || {});
  const [customHolidays, setCustomHolidays] = useState(kpi.customHolidays || {});

  const getCurrentState = () => ({
    name, description, unit, direction, team, owner, driveBy, monitorBy, weightage, totalTargetInput,
    monthlyAlloc, monthlyActual, weeklyAlloc, weeklyActual, dailyAlloc, dailyActual,
    revisedAlloc, customHolidays, holidaysEnabled, kpiType, reportConfig, distributeEnabled, excludeSundays,
    handoffEnabled, handoffMode, parentLabel, childLabel, cutoffTime, bufferMinutes
  });
  
  const [originalState, setOriginalState] = useState(() => JSON.stringify(getCurrentState()));
  const hasChanges = JSON.stringify(getCurrentState()) !== originalState;

  // Live computation for Report KPIs so right side updates dynamically
  useEffect(() => {
    if (kpiType !== 'report') return;

    const runCalc = (extractFn) => {
      if (reportConfig.type === 'sum') {
        const ids = reportConfig.kpiIds || [];
        const related = allKpis.filter(k => ids.includes(k.id?.toString()) || ids.includes(k.id));
        return related.reduce((sum, r) => sum + (extractFn(r) || 0), 0);
      }
      if (reportConfig.type === 'average') {
        const ids = reportConfig.kpiIds || [];
        const related = allKpis.filter(k => ids.includes(k.id?.toString()) || ids.includes(k.id));
        if (related.length === 0) return 0;
        const sum = related.reduce((acc, r) => acc + (extractFn(r) || 0), 0);
        return Math.round((sum / related.length) * 100) / 100;
      }
      if (reportConfig.type === 'percent') {
        const numIds = reportConfig.numeratorIds || [];
        const denIds = reportConfig.denominatorIds || [];
        const numRelated = allKpis.filter(k => numIds.includes(k.id?.toString()) || numIds.includes(k.id));
        const denRelated = allKpis.filter(k => denIds.includes(k.id?.toString()) || denIds.includes(k.id));
        const numSum = numRelated.reduce((acc, r) => acc + (extractFn(r) || 0), 0);
        const denSum = denRelated.reduce((acc, r) => acc + (extractFn(r) || 0), 0);
        if (denSum === 0) return 0;
        return Math.round((numSum / denSum) * 100) / 100; // Return % (e.g. 0.5 becomes 50, but we want 50.00)
      }
      return 0;
    };

    const calcObject = (extractObjFn) => {
      const allKeys = new Set();
      const ids = reportConfig.type === 'percent' 
        ? [...(reportConfig.numeratorIds||[]), ...(reportConfig.denominatorIds||[])] 
        : (reportConfig.kpiIds || []);
      
      const related = allKpis.filter(k => ids.includes(k.id?.toString()) || ids.includes(k.id));
      related.forEach(k => {
        const obj = extractObjFn(k) || {};
        Object.keys(obj).forEach(key => allKeys.add(key));
      });
      
      const res = {};
      allKeys.forEach(key => {
        res[key] = runCalc(k => (extractObjFn(k) || {})[key] || 0);
      });
      return res;
    };

    const newM = calcObject(k => k.monthlyAlloc);
    // Ensure all 12 months exist so UI doesn't crash
    MONTHS_LIST.forEach(m => {
      if (newM[m] === undefined) newM[m] = 0;
    });

    setMonthlyAlloc(newM);
    setDailyAlloc(calcObject(k => k.dailyAlloc));
    setWeeklyAlloc(calcObject(k => k.weeklyAlloc));
    
    // Set actuals so they also reflect live
    // (Note: we need to use a separate state or just rely on the right panel using these states)
    // Wait, the EditKpiModal has no setter for dailyActual except we can just use the setter if we add them.
    // Let's just calculate the summed target for UI
    setTotalTargetInput(runCalc(k => k.target));
  }, [kpiType, reportConfig, allKpis]);

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

    // Default Sunday is a holiday only if excludeSundays is true
    const d = new Date(dateStr);
    if (excludeSundays && d.getDay() === 0) {
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

    MONTHS_LIST.forEach(m => {
      const monthVal = base + (remainder > 0 ? 1 : 0);
      if (remainder > 0) remainder--;
      nextM[m] = monthVal;

      const subRes = distributeMonthToSubperiods(m, monthVal, nextD, nextW, holidaysEnabled, customHolidays, excludeSundays);
      nextW = subRes.nextW;
      nextD = subRes.nextD;
    });

    setMonthlyAlloc(nextM);
    setWeeklyAlloc(nextW);
    setDailyAlloc(nextD);
  };

  const handleMonthlyChange = (monthName, val) => {
    const numVal = Math.round(parseFloat(val) || 0);
    
    // First distribute based on current daily/weekly state
    const subRes = distributeMonthToSubperiods(monthName, numVal, dailyAlloc, weeklyAlloc, holidaysEnabled, customHolidays, excludeSundays);
    
    // Apply updates safely outside of another setter's callback
    setWeeklyAlloc(subRes.nextW);
    setDailyAlloc(subRes.nextD);
    
    setMonthlyAlloc(prev => {
      const nextM = { ...prev, [monthName]: numVal };
      const totalSum = Object.values(nextM).reduce((a, b) => a + b, 0);
      setTotalTargetInput(totalSum);
      return nextM;
    });
  };

  const handleMonthlyActualChange = (monthName, val) => {
    const numVal = Math.round(parseFloat(val) || 0);

    const subRes = distributeMonthActualToSubperiods(monthName, numVal, dailyActual, weeklyActual, holidaysEnabled, customHolidays, excludeSundays);
    setWeeklyActual(subRes.nextWAct);
    setDailyActual(subRes.nextDAct);

    setMonthlyActual(prev => {
      const nextM = { ...prev, [monthName]: numVal };
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
    const nextD = { ...dailyAlloc, [dateStr]: numVal };
    
    const weekDays = getDaysInWeekRow(monthName, weekIdx);
    const wSum = weekDays.reduce((sum, d) => sum + (nextD[d] || 0), 0);
    const weekId = `${monthName}-Week${weekIdx + 1}`;
    
    const mDays = getDaysInMonth(monthName);
    const mSum = mDays.reduce((sum, d) => sum + (nextD[d] || 0), 0);

    setDailyAlloc(nextD);
    setWeeklyAlloc(wPrev => ({ ...wPrev, [weekId]: wSum }));
    setMonthlyAlloc(mPrev => {
      const nextM = { ...mPrev, [monthName]: mSum };
      const totalSum = Object.values(nextM).reduce((a, b) => a + b, 0);
      setTotalTargetInput(totalSum);
      return nextM;
    });
  };

  const handleDailyActualChange = (dateStr, val, monthName, weekIdx) => {
    // Read-only from Admin view: achievements are updated from mobile app.
    return;
  };

  // Revise target logic to roll over daily shortfalls to future working days
  const handleReviseTargets = () => {
    // Preserve other months, but reset the selected month's revised targets to its dailyAlloc baseline before calculating rollover
    const nextRevised = { ...revisedAlloc };
    const days = getDaysInMonth(selectedMonth);
    days.forEach(d => {
      nextRevised[d] = dailyAlloc[d] || 0;
    });

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
      
      if (distributeEnabled) {
        handleAutoDistribute({ customHolidays: nextH });
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
      targetsList: Object.entries(dailyAlloc).filter(([_, val]) => val > 0).map(([dStr, val]) => ({ id: dStr, label: dStr, targetValue: val, targetDate: dStr })),
      kpiType,
      reportConfig: {
        ...reportConfig,
        handoffEnabled,
        handoffMode,
        parentLabel: handoffMode === "drive_social" ? "Google Drive Link" : (handoffMode === "link_handoff" ? "Deliverable Link" : parentLabel),
        childLabel: handoffMode === "drive_social" ? "Social Media Link" : (handoffMode === "link_handoff" ? "Proof of Posting Link" : childLabel),
        cutoffTime,
        bufferMinutes: Number(bufferMinutes)
      }
    });
    setOriginalState(JSON.stringify(getCurrentState()));
  };

  
  return (
    <div className={`fixed inset-y-0 right-0 left-0 lg:${sidebarMinimized ? "left-12" : "left-44"} bg-white flex flex-col p-4 sm:p-6 overflow-hidden shadow-2xl z-40 transition-all duration-300`}>
      <div className="w-full h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-orange-100 pb-3 mb-4 shrink-0">
          <div>
            <h3 className="font-bold text-slate-950 text-lg" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>{kpi.id ? "Edit KPI & Target Distribution" : "Add KPI & Target Distribution"}</h3>
            <p className="text-xs text-slate-600 truncate max-w-xl">{kpi.name}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-6 w-6" /></button>
        </div>

        {/* 2-Column Main Content Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-8 gap-6 min-h-0 mb-4">          
          {/* LEFT COLUMN: KPI METADATA DETAILS (takes 2/8 columns) */}
          <div className="lg:col-span-2 space-y-4 overflow-y-auto pr-3 lg:border-r lg:border-slate-100 pb-2">
            {/* KPI Type Toggle */}
            <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
              <label className="text-[10px] font-bold text-slate-500 mb-2 block uppercase tracking-wider">KPI Data Source</label>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setKpiType('activity')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${kpiType === 'activity' ? 'bg-white shadow-sm text-teal-700' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Activity (Manual)
                </button>
                <button
                  type="button"
                  onClick={() => setKpiType('report')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${kpiType === 'report' ? 'bg-white shadow-sm text-teal-700' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Report (Computed)
                </button>
              </div>
            </div>

            {/* Report Configuration UI */}
            {kpiType === 'report' && (
              <div className="p-3 bg-teal-50/50 border border-teal-100 rounded-xl space-y-3">
                <h4 className="text-[10px] font-bold text-teal-800 uppercase tracking-wider mb-2">Report Configuration</h4>
                
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">Calculation Type</label>
                  <select
                    value={reportConfig.type}
                    onChange={(e) => setReportConfig(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full border border-teal-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-400 font-semibold"
                  >
                    <option value="sum">Sum</option>
                    <option value="average">Average</option>
                    <option value="percent">Percentage (%)</option>
                  </select>
                </div>

                {reportConfig.type !== 'percent' ? (
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-1">Select Included KPIs</label>
                    <KpiCheckboxList
                      kpis={allKpis.filter(k => k.id !== kpi.id && k.kpiType === 'activity')}
                      selectedIds={reportConfig.kpiIds || []}
                      onChange={(newIds) => setReportConfig(prev => ({ ...prev, kpiIds: newIds }))}
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">Numerator KPIs (Top)</label>
                      <KpiCheckboxList
                        kpis={allKpis.filter(k => k.id !== kpi.id && k.kpiType === 'activity')}
                        selectedIds={reportConfig.numeratorIds || []}
                        onChange={(newIds) => setReportConfig(prev => ({ ...prev, numeratorIds: newIds }))}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1 mt-2">Denominator KPIs (Bottom)</label>
                      <KpiCheckboxList
                        kpis={allKpis.filter(k => k.id !== kpi.id && k.kpiType === 'activity')}
                        selectedIds={reportConfig.denominatorIds || []}
                        onChange={(newIds) => setReportConfig(prev => ({ ...prev, denominatorIds: newIds }))}
                      />
                    </div>
                  </>
                )}
              </div>
            )}

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

            <div className="mt-4 pt-4 border-t border-slate-100">
              <label className="text-[10px] font-bold text-slate-500 mb-1 flex items-center gap-1 uppercase tracking-wider">
                <GitBranch className="h-3 w-3" /> Triggers Follow-up KPI (Optional)
              </label>
              <select value={reportConfig.followUpKpiId || ''} onChange={(e) => setReportConfig(prev => ({ ...prev, followUpKpiId: e.target.value }))} className="w-full border border-orange-200 rounded-xl px-2.5 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-300 font-semibold">
                <option value="">None</option>
                {allKpis.filter(k => k.id !== kpi.id).map(k => <option key={k.id} value={k.id}>{k.name} ({k.owner || 'Unassigned'})</option>)}
              </select>
            </div>

            {/* Handoff Settings panel */}
            {reportConfig.followUpKpiId && (
              <div className="mt-3 bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    Enable Handoff Mode
                  </label>
                  <input
                    type="checkbox"
                    checked={handoffEnabled}
                    onChange={(e) => setHandoffEnabled(e.target.checked)}
                    className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                  />
                </div>

                {handoffEnabled && (
                  <div className="space-y-2.5 pt-2 border-t border-slate-200">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">Workflow Mode</label>
                      <select
                        value={handoffMode}
                        onChange={(e) => setHandoffMode(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-teal-400 font-semibold bg-white"
                      >
                        <option value="drive_social">Drive File & Social Post</option>
                        <option value="link_handoff">Generic Link Handoff</option>
                        <option value="custom">Custom Handoff Labels</option>
                      </select>
                    </div>

                    {handoffMode === "custom" && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] font-bold text-slate-500 block mb-0.5">Parent Input Label</label>
                          <input
                            type="text"
                            placeholder="e.g. Catalog Link"
                            value={parentLabel}
                            onChange={(e) => setParentLabel(e.target.value)}
                            className="w-full border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-teal-400"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-slate-500 block mb-0.5">Child Input Label</label>
                          <input
                            type="text"
                            placeholder="e.g. Print Proof Link"
                            value={childLabel}
                            onChange={(e) => setChildLabel(e.target.value)}
                            className="w-full border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-teal-400"
                          />
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] font-bold text-slate-500 block mb-0.5">Cutoff Time (Child Target)</label>
                        <input
                          type="time"
                          value={cutoffTime}
                          onChange={(e) => setCutoffTime(e.target.value)}
                          className="w-full border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-teal-400"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-slate-500 block mb-0.5">Buffer Minutes</label>
                        <input
                          type="number"
                          value={bufferMinutes}
                          onChange={(e) => setBufferMinutes(e.target.value)}
                          className="w-full border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-teal-400"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: TARGET SCHEDULING & DISTRIBUTION (takes 6/8 columns) */}
          <div className="lg:col-span-6 flex flex-col min-h-0 pl-3">
            {kpiType === 'report' ? (
              <div className="h-full flex flex-col bg-slate-50/50 rounded-2xl border border-slate-200 overflow-hidden shadow-inner">
                {/* Header */}
                <div className="bg-purple-50 p-4 border-b border-purple-100 flex items-center justify-between shrink-0">
                  <div>
                    <h3 className="text-sm font-bold text-purple-900">Report Components Preview</h3>
                    <p className="text-xs text-purple-700/80 mt-0.5">Review the individual targets and actuals of the selected KPIs.</p>
                  </div>
                  <div className="text-right bg-white px-3 py-1.5 rounded-lg border border-purple-100 shadow-sm">
                    <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Calculated Final Target</span>
                    <span className="text-xl font-black text-slate-800">{totalTargetInput} <span className="text-xs font-bold text-slate-400">{unit}</span></span>
                  </div>
                </div>

                {/* Body: Table(s) */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {(() => {
                     const monthsList = MONTHS_LIST;
                     const SelectedKpiTable = ({ title, kpisList }) => (
                       <div className="mb-4">
                         {title && <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">{title}</h4>}
                         <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
                           <table className="w-full text-left border-collapse min-w-max">
                             <thead>
                               <tr className="bg-slate-50 border-b border-slate-200">
                                 <th className="px-3 py-2.5 text-[10px] font-bold text-slate-500 uppercase sticky left-0 bg-slate-50 z-10 border-r border-slate-200">KPI Name</th>
                                 <th className="px-3 py-2.5 text-[10px] font-bold text-slate-500 uppercase">Owner</th>
                                 {monthsList.map(m => (
                                   <th key={m} className="px-2 py-2.5 text-[10px] font-bold text-slate-500 uppercase text-right">{m}</th>
                                 ))}
                                 <th className="px-3 py-2.5 text-[10px] font-bold text-slate-800 uppercase text-right bg-orange-50/50">Total Tgt</th>
                                 <th className="px-3 py-2.5 text-[10px] font-bold text-teal-700 uppercase text-right bg-teal-50/50">YTD Act</th>
                               </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-100">
                               {kpisList.length === 0 ? (
                                 <tr><td colSpan={16} className="px-4 py-8 text-center text-xs font-medium text-slate-400 italic">No KPIs selected</td></tr>
                               ) : (
                                 kpisList.map(k => (
                                   <tr key={k.id} className="hover:bg-slate-50 transition-colors group">
                                     <td className="px-3 py-2 text-[11px] font-bold text-slate-700 max-w-[150px] truncate sticky left-0 bg-white group-hover:bg-slate-50 z-10 border-r border-slate-100" title={k.name}>{k.name}</td>
                                     <td className="px-3 py-2 text-[10px] text-slate-500">{k.owner}</td>
                                     {monthsList.map(m => (
                                       <td key={m} className="px-2 py-2 text-[11px] text-slate-600 text-right">{k.monthlyAlloc?.[m] || 0}</td>
                                     ))}
                                     <td className="px-3 py-2 text-[11px] font-bold text-slate-800 text-right bg-orange-50/30">{k.target} <span className="text-[9px] text-slate-400 font-normal">{k.unit}</span></td>
                                     <td className="px-3 py-2 text-[11px] font-bold text-teal-600 text-right bg-teal-50/30">{Object.values(k.monthlyActual||{}).reduce((a,b)=>a+b,0)} <span className="text-[9px] text-teal-400 font-normal">{k.unit}</span></td>
                                   </tr>
                                 ))
                               )}
                             </tbody>
                           </table>
                         </div>
                       </div>
                     );

                     if (reportConfig.type !== 'percent') {
                       const list = allKpis.filter(k => reportConfig.kpiIds?.includes(k.id?.toString()) || reportConfig.kpiIds?.includes(k.id));
                       return <SelectedKpiTable title="" kpisList={list} />;
                     } else {
                       const numList = allKpis.filter(k => reportConfig.numeratorIds?.includes(k.id?.toString()) || reportConfig.numeratorIds?.includes(k.id));
                       const denList = allKpis.filter(k => reportConfig.denominatorIds?.includes(k.id?.toString()) || reportConfig.denominatorIds?.includes(k.id));
                       return (
                         <>
                           <SelectedKpiTable title="Numerator KPIs (Top)" kpisList={numList} />
                           <SelectedKpiTable title="Denominator KPIs (Bottom)" kpisList={denList} />
                         </>
                       );
                     }
                  })()}
                </div>

              </div>
            ) : (
              <div className="flex flex-col min-h-0 space-y-4">
            {/* Target Assignment Info Header */}
            <div className="flex flex-col gap-2 shrink-0">


            <div className="bg-orange-50/20 p-3 rounded-2xl border border-orange-100/50 flex items-center justify-between">
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
                <button
                  onClick={onClose}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-1.5 rounded-lg transition-colors text-xs border border-slate-200"
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={!canSubmit || !hasChanges}
                  onClick={handleSubmit}
                  className="bg-teal-500 hover:bg-teal-600 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold px-4 py-1.5 rounded-lg transition-colors text-xs shadow-sm"
                >
                  Save Targets
                </button>
              </div>
            </div>
            </div>

            {/* Scrollable Month Line Editor (Grid: fits all 12 on one screen width) */}
            <div className="shrink-0">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-600 block uppercase tracking-wider">Monthly Targets & Achievements (FY 2026-27) *</label>
                <div className="flex items-center gap-4">
                  {distributeEnabled && (
                    <>
                      <button
                        type="button"
                        onClick={handleClearTargets}
                        className="text-xs font-bold px-2 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded hover:bg-rose-100 transition-colors"
                      >
                        Clear Targets
                      </button>
                      <button
                        type="button"
                        onClick={handleAutoDistribute}
                        className="text-xs font-bold px-2 py-1 bg-teal-50 text-teal-700 border border-teal-200 rounded hover:bg-teal-100 transition-colors"
                      >
                        Auto Distribute
                      </button>
                      <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-600 select-none">
                        <input 
                          type="checkbox" 
                          checked={excludeSundays} 
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            setExcludeSundays(isChecked);
                            if (distributeEnabled) handleAutoDistribute({ excludeSundays: isChecked });
                          }} 
                          className="w-4 h-4 rounded border-orange-200 text-teal-600 focus:ring-teal-300"
                        />
                        Exclude Sundays
                      </label>
                    </>
                  )}
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
              </div>
              <div className="grid grid-cols-6 lg:grid-cols-12 gap-1.5">
                {MONTHS_LIST.map(m => {
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
                      <span className="text-[10px] xl:text-xs font-bold text-slate-600 block mb-1 uppercase tracking-wider whitespace-nowrap">{m}</span>
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
                        <p className="text-xs text-slate-500">Allocated Daily Sum: <span className="font-bold text-slate-700">{formatIndianNumber(monthDailySum) || "0"}</span> {unit}</p>
                        {!isTimeKpi && monthMismatch !== 0 && (
                          <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md animate-pulse">
                            ⚠ Mismatch: {monthMismatch > 0 ? `+${formatIndianNumber(monthMismatch) || "0"}` : (formatIndianNumber(monthMismatch) || "0")} {unit}
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
                              return <div key={`empty-${r}-${cIdx}`} className="bg-slate-100/20 rounded-xl h-auto min-h-[65px] pb-1 border border-dashed border-slate-100" />;
                            }

                            const dayTarget = dailyAlloc[cell.dateStr] || 0;
                            const dayRevised = revisedAlloc[cell.dateStr] ?? dayTarget;
                            const dayActual = dailyActual[cell.dateStr] || 0;
                            const parentTarget = parentKpi?.dailyAlloc?.[cell.dateStr] || 0;
                            const parentActual = parentKpi?.dailyActual?.[cell.dateStr] || 0;
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
                            } else if (!isTimeKpi && dayTarget > 0 && !check.isHoliday && !isLeave && !isPartialLeave) {
                              cellBg = "bg-teal-50/20 border-teal-200 ring-1 ring-teal-50";
                            }

                            return (
                              <div
                                key={cell.dateStr}
                                onClick={() => {
                                  if (isTimeKpi) {
                                    handleDailyChange(cell.dateStr, dayTarget > 0 ? 0 : 1, selectedMonth, r);
                                  }
                                }}
                                className={`border rounded-xl p-1 text-center flex flex-col justify-between h-auto min-h-[65px] pb-1 ${cellBg} shadow-sm transition-all hover:border-slate-300 ${isTimeKpi ? "cursor-pointer" : ""}`}
                              >
                                <div className="flex justify-between items-center text-[10px] px-1 shrink-0">
                                  <span className={`font-bold ${dayTarget > 0 ? "text-teal-800" : "text-slate-500"}`}>{cell.dayNum}</span>
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
                                <div className="flex flex-col gap-[2px] mt-0.5 w-full px-0.5">

                                  {/* Line 1: T (Target) — always shown */}
                                  <div className="flex items-center justify-between w-full leading-none">
                                    <span className="text-[9px] font-bold text-slate-400">T:</span>
                                    {isTimeKpi ? (
                                      <span className={`text-[9px] font-bold ${dayTarget > 0 ? 'text-teal-700' : 'text-slate-300'}`}>
                                        {dayTarget > 0 ? 'Set' : '0'}
                                      </span>
                                    ) : (
                                      <div className="flex items-center gap-0.5">
                                        <input
                                          type="text"
                                          value={formatIndianNumber(dayTarget)}
                                          onChange={(e) => handleDailyChange(cell.dateStr, parseIndianNumber(e.target.value), selectedMonth, r)}
                                          className={`w-full max-w-[52px] text-right text-[9px] focus:outline-none bg-transparent font-bold border-b border-dashed placeholder:text-slate-300 ${dayTarget > 0 ? 'text-teal-700 border-teal-200' : 'text-slate-300 border-slate-100'}`}
                                          placeholder="0"
                                          title="Original Target"
                                        />
                                        {dayRevised !== dayTarget && dayActual !== dayTarget && (
                                          <span className="text-[7.5px] text-teal-700 font-extrabold bg-teal-50 border border-teal-100 px-0.5 rounded" title="Revised">
                                            R:{formatIndianNumber(dayRevised)}
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>

                                  {/* Line 2: A (Actual) — always shown */}
                                  <div className="flex items-center justify-between w-full leading-none">
                                    <span className="text-[9px] font-bold text-slate-400">A:</span>
                                    {isTimeKpi ? (
                                      <span className={`text-[9px] font-bold ${dayActual > 0 ? 'text-emerald-700' : 'text-slate-300'}`}>
                                        {dayActual > 0 ? 'Done' : '0'}
                                      </span>
                                    ) : (
                                      <span className={`text-[9px] font-bold text-right ${dayActual > 0 ? 'text-emerald-700' : 'text-slate-300'}`} title="Achievement">
                                        {formatIndianNumber(dayActual) || '0'}
                                      </span>
                                    )}
                                  </div>

                                  {/* Line 3: PT (Parent Target) — only if parentKpi exists */}
                                  {parentKpi && (
                                    <div className="flex items-center justify-between w-full leading-none">
                                      <span className="text-[9px] font-bold text-amber-600">PT:</span>
                                      <span className="text-[9px] font-bold text-amber-700 text-right">
                                        {formatIndianNumber(parentTarget) || '0'}
                                      </span>
                                    </div>
                                  )}

                                  {/* Line 4: PS (Parent Status) — only if parentKpi exists */}
                                  {parentKpi && (
                                    <div className="flex items-center justify-between w-full leading-none">
                                      <span className="text-[9px] font-bold text-slate-400">PS:</span>
                                      {parentTarget > 0
                                        ? (parentActual >= parentTarget
                                            ? <span className="text-[9px] font-bold text-emerald-600">Done</span>
                                            : <span className="text-[9px] font-bold text-rose-500 animate-pulse">Pend</span>
                                          )
                                        : <span className="text-[9px] text-slate-300">—</span>
                                      }
                                    </div>
                                  )}

                                </div>

                              </div>
                            );
                          })}

                          {/* 8th Column: Weekly Total */}
                          <div className={`border rounded-xl p-1 text-center flex flex-col justify-between h-auto min-h-[65px] pb-1 shadow-sm transition-all ${weekVal > 0 ? 'bg-teal-50/60 border-teal-200 hover:border-teal-300' : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'}`}>
                            <span className={`text-[9px] font-bold block uppercase tracking-wider font-mono shrink-0 ${weekVal > 0 ? 'text-teal-850' : 'text-slate-400'}`}>W{r + 1} Total</span>
                            <div className="flex flex-col gap-0.5 mt-0.5">
                              {isTimeKpi ? (
                                <div className="flex flex-col items-center justify-center gap-0.5">
                                  <span className={`text-[10px] font-bold ${weekVal > 0 ? 'text-teal-800' : 'text-slate-300'}`}>T: {weekVal}</span>
                                  <span className={`text-[10px] font-bold ${weekActVal > 0 ? 'text-emerald-800' : 'text-slate-300'}`}>A: {weekActVal}</span>
                                </div>
                              ) : (
                                <>
                                  <div className={`w-full text-center text-xs font-extrabold leading-none h-4 ${weekVal > 0 ? 'text-teal-900' : 'text-slate-300'}`} title="Weekly Target (Derived)">
                                    T: {formatIndianNumber(weekVal) || "0"}
                                  </div>
                                  <div className={`w-full text-center text-xs font-bold leading-none h-4 ${weekActVal > 0 ? 'text-emerald-800' : 'text-slate-300'}`} title="Weekly Achievement (Read-only)">
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
            )}
          </div>
        </div>


      </div>
    </div>
  );
}



function ActionScreen({ kpis, projects, user, onCompleteAction, teams, clientProjects, onUpdateClientProjectStage }) {
  const [activeDate, setActiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [editingSlot, setEditingSlot] = useState(null);
  const [title, setTitle] = useState("");
  const [objective, setObjective] = useState("");
  const [submissionLink, setSubmissionLink] = useState("");
  const [delayReason, setDelayReason] = useState("");
  const [isReportingDelay, setIsReportingDelay] = useState(false);
  
  // Delegated Task modal states
  const [showDelegateModal, setShowDelegateModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskObjective, setTaskObjective] = useState("");
  const [taskOutcome, setTaskOutcome] = useState("");
  const [taskTargetDate, setTaskTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [taskAssignee, setTaskAssignee] = useState("");
  const [taskKpiId, setTaskKpiId] = useState("");

  // Rescheduling state
  const [reschedulingProjectId, setReschedulingProjectId] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleReason, setRescheduleReason] = useState("");

  // Repetitive Task Configuration states
  const [isRepetitive, setIsRepetitive] = useState(false);
  const [repetitiveFrequency, setRepetitiveFrequency] = useState("daily");
  const [weeklyDay, setWeeklyDay] = useState("Monday");
  const [monthlyDate, setMonthlyDate] = useState(1);

  // Month-wise past pending filter state (April to March fiscal layout)
  const [selectedPendingMonth, setSelectedPendingMonth] = useState(new Date().toISOString().split('-')[1]);

  // KPI Search dropdown states
  const [kpiSearchQuery, setKpiSearchQuery] = useState("");
  const [showKpiDropdown, setShowKpiDropdown] = useState(false);

  const myKpis = kpis.filter(k => k.owner === user);
  const myProjects = projects.filter(p => {
    if (p.assignedTo !== user) return false;
    try {
      const meta = JSON.parse(p.description);
      return meta.type === "action_item" || meta.type === "delegated_task";
    } catch(e) { return false; }
  });

  const parsedProjects = myProjects.map(p => {
    let meta = {};
    try { meta = JSON.parse(p.description); } catch(e) {}
    return { ...p, meta };
  });

  // Calculate action slots from KPI dailyAlloc
  const actionSlots = [];
  myKpis.forEach(kpi => {
    Object.entries(kpi.dailyAlloc || {}).forEach(([dateStr, targetVal]) => {
      if (targetVal > 0) {
        // Find completed projects for this KPI on this date
        const completedForKpiDate = parsedProjects.filter(p => p.meta.status === 'completed' && p.kpiId === kpi.id && p.meta.targetDate === dateStr);
        
        const loopCount = Math.min(Number(targetVal), 10); // Prevent browser freeze for huge targets
        for (let i = 0; i < loopCount; i++) {
          actionSlots.push({
            id: `slot_${kpi.id}_${dateStr}_${i}`,
            kpiId: kpi.id,
            kpiName: kpi.name,
            date: dateStr,
            slotIndex: i,
            followUpKpiId: kpi.reportConfig?.followUpKpiId,
            completedProject: completedForKpiDate[i] || null,
            type: 'alloc'
          });
        }
      }
    });
  });

  // Add pending actions triggered by other people's KPIs
  const pendingActions = parsedProjects.filter(p => p.meta.status === 'pending');
  pendingActions.forEach(p => {
    actionSlots.push({
      id: `pending_${p.id}`,
      kpiId: p.kpiId,
      kpiName: kpis.find(k => k.id === p.kpiId)?.name || "Linked KPI",
      date: p.meta.targetDate,
      pendingProject: p,
      type: 'pending'
    });
  });

  // Add accepted/delayed delegated tasks to active day checklist
  const activeTasks = parsedProjects.filter(p => p.meta.type === 'delegated_task' && (p.meta.status === 'accepted' || p.meta.status === 'delayed'));
  activeTasks.forEach(p => {
    actionSlots.push({
      id: `delegated_${p.id}`,
      kpiId: p.kpiId || null,
      kpiName: p.kpiId ? (kpis.find(k => k.id === p.kpiId)?.name || "Linked KPI") : "Independent Task",
      date: p.targetDate,
      pendingProject: p,
      type: 'delegated_active'
    });
  });

  // Filter slots for active date
  const slotsForDate = actionSlots.filter(s => s.date === activeDate);

  // Get all members for Assignee Dropdown
  const allMembers = teams.flatMap(t => t.members);
  const assigneeOptions = allMembers.filter((m, i, arr) => arr.findIndex(x => x.name === m.name) === i);

  // New Incoming Task Requests (pending delegated tasks)
  const incomingTaskRequests = parsedProjects.filter(p => p.meta.type === 'delegated_task' && p.meta.status === 'pending');

  // Past Pending Work (incomplete before activeDate)
  const pastPendingSlots = actionSlots.filter(s => {
    if (s.date >= activeDate) return false;
    const isCompleted = s.type === 'alloc' ? !!s.completedProject : (s.pendingProject?.status === 'completed' || s.pendingProject?.meta?.status === 'completed');
    return !isCompleted;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/50 p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <ListTodo className="h-6 w-6 text-teal-600" /> Action Screen
        </h2>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setShowDelegateModal(true);
              if (assigneeOptions.length > 0) setTaskAssignee(assigneeOptions[0].name);
            }} 
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm transition-all shadow-sm hover:shadow-md"
          >
            <Plus className="h-4 w-4" /> Delegate Task
          </button>
          <input type="date" value={activeDate} onChange={(e) => setActiveDate(e.target.value)} className="border border-slate-200 rounded-xl px-4 py-2 font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-300" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {/* CLIENT BUILD PROJECTS STAGES TRACKING PANEL */}
        {clientProjects && clientProjects.length > 0 && (
          <div className="bg-teal-500/5 border border-teal-100/80 rounded-3xl p-5 space-y-3 shadow-sm">
            <h3 className="text-sm font-bold text-teal-800 flex items-center gap-1.5 uppercase tracking-wider">
              <FolderGit2 className="h-4 w-4 text-teal-600" /> Build Projects Milestone Checklist
            </h3>
            
            {/* Masonry Layout grid matching Build projects screen */}
            <div className="columns-1 md:columns-2 gap-4 space-y-4 [column-fill:_balance] break-inside-avoid">
              {clientProjects.map(proj => {
                const pendingStages = proj.stages.filter(s => s.status !== "completed");
                if (pendingStages.length === 0) return null;
                return (
                  <div key={proj.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-2 break-inside-avoid inline-block w-full mb-4">
                    <div className="flex justify-between items-center border-b border-slate-50 pb-1.5">
                      <h4 className="font-bold text-slate-800 text-xs truncate max-w-[150px]">{proj.title}</h4>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {Math.round((proj.stages.filter(s => s.status === "completed").length / proj.stages.length) * 100)}% Done
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {proj.stages.map((stg, sIdx) => {
                        const isCurrent = sIdx === proj.currentStageIdx;
                        const isCompleted = stg.status === "completed";
                        
                        return (
                          <div key={stg.id || sIdx} className="space-y-2 bg-slate-50/70 rounded-xl p-3 border border-slate-100 hover:bg-slate-50 transition-colors">
                            {/* Main Stage Row */}
                            <div className="flex items-center justify-between text-sm gap-4">
                              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                <input 
                                  type="checkbox" 
                                  checked={isCompleted}
                                  onChange={() => {
                                    const nextStatus = isCompleted ? "current" : "completed";
                                    onUpdateClientProjectStage(proj.id, sIdx, nextStatus);
                                  }}
                                  className="rounded text-teal-600 focus:ring-teal-500 h-4.5 w-4.5 shrink-0 cursor-pointer" 
                                />
                                <span className={`font-bold text-slate-800 truncate ${isCompleted ? "line-through text-slate-400" : isCurrent ? "text-orange-600 font-extrabold" : ""}`}>
                                  {stg.name}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-2 shrink-0 text-xs">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${isCompleted ? "bg-teal-50 text-teal-700 border border-teal-100" : isCurrent ? "bg-orange-50 text-orange-700 border border-orange-100" : "bg-slate-100 text-slate-650"}`}>
                                  {isCompleted ? "Completed" : isCurrent ? "Current" : "Pending"}
                                </span>
                                {stg.responsible && <span className="bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold" title={stg.responsible}>Resp: {stg.responsible}</span>}
                                {stg.targetDate && <span className="text-slate-500 font-semibold font-mono bg-slate-100/50 px-1.5 py-0.5 rounded text-[10px]">Due: {stg.targetDate.split("-")[1]}/{stg.targetDate.split("-")[2]}</span>}
                              </div>
                            </div>

                            {/* Sub-stages list with checkboxes */}
                            {stg.subStages && stg.subStages.length > 0 && (
                              <div className="pl-6 border-l-2 border-slate-200/80 space-y-2 mt-2">
                                {stg.subStages.map((sub, subIdx) => {
                                  const isSubCompleted = sub.status === "completed";
                                  const isSubCurrent = sub.status === "current";
                                  return (
                                    <div key={sub.id || subIdx} className="space-y-1.5 bg-white/60 p-2 rounded-lg border border-slate-100/40">
                                      <div className="flex justify-between items-center text-xs gap-4">
                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                          <input 
                                            type="checkbox" 
                                            checked={isSubCompleted}
                                            onChange={() => {
                                              const nextStatus = isSubCompleted ? "pending" : "completed";
                                              onUpdateClientProjectStage(proj.id, sIdx, nextStatus, subIdx);
                                            }}
                                            className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4 shrink-0 cursor-pointer" 
                                          />
                                          <span className={`font-semibold text-slate-700 truncate ${isSubCompleted ? "line-through text-slate-400" : ""}`}>↳ {sub.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0 text-[10px]">
                                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${isSubCompleted ? "bg-teal-50 text-teal-600" : isSubCurrent ? "bg-orange-50 text-orange-650" : "bg-slate-100 text-slate-500"}`}>
                                            {isSubCompleted ? "Done" : isSubCurrent ? "Current" : "Pending"}
                                          </span>
                                          {sub.responsible && <span className="bg-slate-100 text-slate-650 px-1.5 py-0.5 rounded font-medium">Resp: {sub.responsible}</span>}
                                          {sub.targetDate && <span className="text-slate-500 font-semibold font-mono">Due: {sub.targetDate.split("-")[1]}/{sub.targetDate.split("-")[2]}</span>}
                                        </div>
                                      </div>

                                      {/* Sub-sub stages list with checkboxes */}
                                      {sub.subSubStages && sub.subSubStages.length > 0 && (
                                        <div className="pl-5 border-l-2 border-dashed border-slate-200 space-y-1 mt-1 text-[11px]">
                                          {sub.subSubStages.map((ss, ssIdx) => {
                                            const isSubSubCompleted = ss.status === "completed";
                                            const isSubSubCurrent = ss.status === "current";
                                            return (
                                              <div key={ss.id || ssIdx} className="flex justify-between items-center text-slate-600 gap-3 py-0.5">
                                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                                  <input 
                                                    type="checkbox" 
                                                    checked={isSubSubCompleted}
                                                    onChange={() => {
                                                      const nextStatus = isSubSubCompleted ? "pending" : "completed";
                                                      onUpdateClientProjectStage(proj.id, sIdx, nextStatus, subIdx, ssIdx);
                                                    }}
                                                    className="rounded text-teal-500 focus:ring-teal-500 h-3.5 w-3.5 shrink-0 cursor-pointer" 
                                                  />
                                                  <span className={`truncate ${isSubSubCompleted ? "line-through text-slate-400" : ""}`}>↳ {ss.name}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[9px] shrink-0">
                                                  <span className={`px-1 py-0.2 rounded text-[8px] uppercase tracking-wider font-bold ${isSubSubCompleted ? "bg-teal-50 text-teal-500" : isSubSubCurrent ? "bg-orange-50 text-orange-600" : "bg-slate-100 text-slate-400"}`}>
                                                    {isSubSubCompleted ? "Done" : isSubSubCurrent ? "Active" : "Pending"}
                                                  </span>
                                                  {ss.responsible && <span className="truncate max-w-[50px] text-slate-500">Resp: {ss.responsible}</span>}
                                                  {ss.targetDate && <span className="text-slate-400 font-mono font-semibold">Due: {ss.targetDate.split("-")[1]}/{ss.targetDate.split("-")[2]}</span>}
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {/* Incoming Task Requests Panel */}
        {incomingTaskRequests.length > 0 && (
          <div className="bg-amber-50/40 border border-amber-100 rounded-3xl p-5 space-y-3 mb-4 shadow-sm">
            <h3 className="text-sm font-bold text-amber-800 flex items-center gap-1.5 uppercase tracking-wider">
              <GitBranch className="h-4 w-4" /> New Task Requests ({incomingTaskRequests.length})
            </h3>
            <div className="space-y-3">
              {incomingTaskRequests.map(task => {
                const isRescheduling = reschedulingProjectId === task.id;
                return (
                  <div key={task.id} className="bg-white rounded-2xl p-4 border border-amber-100 shadow-sm space-y-3">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{task.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 font-semibold">
                        Assigned By: {task.meta.creator || "Manager"} · Target: {task.targetDate}
                      </p>
                      {task.meta.objective && (
                        <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded-lg italic">
                          Objective: {task.meta.objective}
                        </p>
                      )}
                      {task.meta.expectedOutcome && (
                        <p className="text-xs text-slate-600 mt-1.5 bg-slate-50 p-2 rounded-lg italic">
                          Outcome: {task.meta.expectedOutcome}
                        </p>
                      )}
                    </div>

                    {!isRescheduling ? (
                      <div className="flex items-center gap-2 pt-1">
                        <button 
                          onClick={() => onCompleteAction({ type: 'accept_task', project: task })}
                          className="px-3.5 py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg text-xs transition-colors"
                        >
                          Accept Task
                        </button>
                        {task.meta.rescheduleCount === 0 && (
                          <button 
                            onClick={() => {
                              setReschedulingProjectId(task.id);
                              setRescheduleDate(task.targetDate);
                            }}
                            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-lg text-xs transition-colors"
                          >
                            Reschedule
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="bg-slate-50 p-3 rounded-xl space-y-2 border border-slate-200">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block mb-0.5">New Target Date</label>
                            <input 
                              type="date" 
                              value={rescheduleDate} 
                              onChange={(e) => setRescheduleDate(e.target.value)} 
                              className="w-full border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400 bg-white" 
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Reschedule Reason</label>
                            <input 
                              type="text" 
                              placeholder="Why reschedule?" 
                              value={rescheduleReason} 
                              onChange={(e) => setRescheduleReason(e.target.value)} 
                              className="w-full border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400 bg-white" 
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 pt-1">
                          <button 
                            onClick={() => {
                              if (!rescheduleReason.trim()) {
                                alert("Please enter a reason for rescheduling.");
                                return;
                              }
                              onCompleteAction({ type: 'reschedule_task', project: task, newDate: rescheduleDate, reason: rescheduleReason });
                              setReschedulingProjectId(null);
                              setRescheduleReason("");
                            }}
                            className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-xs transition-colors"
                          >
                            Submit
                          </button>
                          <button 
                            onClick={() => setReschedulingProjectId(null)}
                            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-lg text-xs transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION: Past Pending Work */}
        {(() => {
          // Fiscal Month mapping definitions (April to March)
          const fiscalMonths = [
            { name: "Apr", val: "04" },
            { name: "May", val: "05" },
            { name: "Jun", val: "06" },
            { name: "Jul", val: "07" },
            { name: "Aug", val: "08" },
            { name: "Sep", val: "09" },
            { name: "Oct", val: "10" },
            { name: "Nov", val: "11" },
            { name: "Dec", val: "12" },
            { name: "Jan", val: "01" },
            { name: "Feb", val: "02" },
            { name: "Mar", val: "03" }
          ];

          // Set default active month to current system month if not yet set
          const currentMonthCode = new Date().toISOString().split('-')[1]; // e.g. "08"
          const hasSelectedMonth = fiscalMonths.some(m => m.val === selectedPendingMonth);
          const activePendingMonth = hasSelectedMonth ? selectedPendingMonth : currentMonthCode;

          // Filter past pending items for selected month
          const filteredPastPending = pastPendingSlots.filter(slot => {
            if (!slot.date) return false;
            const itemMonth = slot.date.split("-")[1]; // YYYY-MM-DD
            return itemMonth === activePendingMonth;
          });

          // Compute targets vs actuals counts
          const totalMonthlyTarget = filteredPastPending.length;
          // Completed ones are either slot.completedProject or slot status is completed
          const totalMonthlyActual = pastPendingSlots.filter(slot => {
            if (!slot.date) return false;
            const itemMonth = slot.date.split("-")[1];
            if (itemMonth !== activePendingMonth) return false;
            const isCompleted = slot.type === 'alloc' ? !!slot.completedProject : (slot.pendingProject?.status === 'completed' || slot.pendingProject?.meta?.status === 'completed');
            return isCompleted;
          }).length;

          return (
            <div className="space-y-4">
              {/* Horizontal Fiscal Month Navigation Bar */}
              <div className="bg-white border border-slate-200 rounded-2xl p-2.5 shadow-xs flex items-center justify-between gap-3 overflow-x-auto shrink-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  {fiscalMonths.map(m => (
                    <button
                      key={m.val}
                      onClick={() => setSelectedPendingMonth(m.val)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        activePendingMonth === m.val
                          ? "bg-teal-600 text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
                <div className="bg-teal-50 border border-teal-100 rounded-xl px-3.5 py-1.5 text-right shrink-0">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-teal-800 block">Pending Month Stats</span>
                  <span className="text-xs font-bold text-teal-900 font-mono">
                    Target vs Actual: {totalMonthlyTarget} / {totalMonthlyActual}
                  </span>
                </div>
              </div>

              {filteredPastPending.length > 0 && (
                <div className="bg-rose-50/20 border border-rose-100/50 rounded-3xl p-5 space-y-3 mb-4 shadow-sm">
                  <h3 className="text-sm font-bold text-rose-800 flex items-center gap-1.5 uppercase tracking-wider">
                    ⚠️ Past Pending Work (Needs Attention)
                  </h3>
                  <div className="space-y-3">
                    {filteredPastPending.map(slot => {
                const isCompleted = slot.type === 'alloc' ? !!slot.completedProject : false;
                if (editingSlot === slot.id) {
                  const kpiObj = kpis.find(k => k.id === slot.kpiId);
                  const parentKpiObj = kpis.find(k => String(k.reportConfig?.followUpKpiId) === String(slot.kpiId));
                  const isParentHandoff = kpiObj?.reportConfig?.handoffEnabled && kpiObj?.reportConfig?.followUpKpiId;
                  const isChildHandoff = parentKpiObj?.reportConfig?.handoffEnabled;

                  let parentLink = "";
                  let parentDelayed = false;
                  let parentDelayReason = "";
                  if (isChildHandoff && slot.type === 'pending') {
                     try {
                       const meta = JSON.parse(slot.pendingProject.description);
                       parentLink = meta.parentLink || "";
                       parentDelayed = meta.parentDelayed || false;
                       parentDelayReason = meta.parentDelayReason || "";
                     } catch(e) {}
                  }

                  return (
                    <div key={slot.id} className="bg-white rounded-2xl p-4 border border-rose-200 shadow-sm space-y-3">
                      <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wider">{slot.kpiName} - Action Details</h4>
                      
                      {isChildHandoff && parentDelayed && (
                        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3 py-2 rounded-xl text-xs font-semibold">
                          ⚠️ Parent Delivery Delayed: {parentDelayReason}
                        </div>
                      )}

                      {isChildHandoff && parentLink && (
                        <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs flex items-center justify-between">
                          <span className="text-slate-500 font-medium">Parent Deliverable:</span>
                          <a href={parentLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 underline font-bold">
                            Download / View File
                          </a>
                        </div>
                      )}

                      {!isReportingDelay ? (
                        <>
                          <div className="space-y-3">
                            <input type="text" placeholder="Title (e.g., Onam Poster)" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300" />
                            <textarea placeholder="Objective / Notes" value={objective} onChange={(e) => setObjective(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300" rows={2} />
                            
                            {isParentHandoff && (
                              <input 
                                type="text" 
                                placeholder={kpiObj.reportConfig.parentLabel || "Google Drive Link"} 
                                value={submissionLink} 
                                onChange={(e) => setSubmissionLink(e.target.value)} 
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 font-semibold"
                              />
                            )}

                            {isChildHandoff && slot.type === 'pending' && (
                              <input 
                                type="text" 
                                placeholder={parentKpiObj.reportConfig.childLabel || "Social Media Link"} 
                                value={submissionLink} 
                                onChange={(e) => setSubmissionLink(e.target.value)} 
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 font-semibold"
                              />
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button onClick={() => {
                              if ((isParentHandoff || (isChildHandoff && slot.type === 'pending')) && !submissionLink.trim()) {
                                alert("Please provide the required submission link before completing.");
                                return;
                              }
                              onCompleteAction({ ...slot, title, objective, submissionLink });
                              setEditingSlot(null);
                              setSubmissionLink("");
                            }} className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-1.5 px-3 rounded-lg text-xs transition-colors">Mark as Completed</button>
                            
                            {isParentHandoff && (
                              <button onClick={() => setIsReportingDelay(true)} className="bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold py-1.5 px-3 rounded-lg text-xs transition-colors">Report Delay</button>
                            )}
                            
                            <button onClick={() => { setEditingSlot(null); setSubmissionLink(""); }} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-1.5 px-3 rounded-lg text-xs transition-colors">Cancel</button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-600 block">Delay Reason & Support Needed</label>
                            <textarea 
                              placeholder="Why is it delayed & what support is needed?" 
                              value={delayReason} 
                              onChange={(e) => setDelayReason(e.target.value)} 
                              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" 
                              rows={2} 
                            />
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <button onClick={() => {
                              if (!delayReason.trim()) {
                                alert("Please enter a reason.");
                                return;
                              }
                              onCompleteAction({ ...slot, isDelayed: true, delayReason, title: "Delayed: " + slot.kpiName });
                              setIsReportingDelay(false);
                              setEditingSlot(null);
                              setDelayReason("");
                            }} className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-1.5 px-3 rounded-lg text-xs transition-colors">Submit Blocker</button>
                            <button onClick={() => setIsReportingDelay(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-1.5 px-3 rounded-lg text-xs transition-colors">Back</button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                }

                return (
                  <div key={slot.id} className="bg-white rounded-2xl p-4 border border-rose-100 shadow-sm flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded">{slot.kpiName}</span>
                        <span className="text-[9px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Due: {slot.date}</span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm">
                        {slot.type === 'pending' ? slot.pendingProject.title : "Pending Action " + (slot.slotIndex + 1)}
                      </h4>
                    </div>
                    <button 
                      onClick={() => {
                        setEditingSlot(slot.id);
                        setTitle(slot.type === 'pending' ? slot.pendingProject.title : '');
                      }}
                      className="px-3.5 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-lg text-xs transition-colors shadow-sm"
                    >
                      Resolve Blocker
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

              {filteredPastPending.length === 0 && (
                <div className="text-center text-slate-400 py-6 bg-white rounded-3xl border border-slate-100/80 shadow-xs">
                  No past pending work items found for the selected month.
                </div>
              )}
            </div>
          );
        })()}

        {/* SECTION: Today's Scheduled Tasks */}
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1 pt-2">Today's Schedule</h3>
        {slotsForDate.length === 0 ? (
          <div className="text-center text-slate-400 py-10 bg-white rounded-3xl border border-slate-100">No actions scheduled for this date.</div>
        ) : (
          slotsForDate.map(slot => {
            const isCompleted = slot.type === 'alloc' ? !!slot.completedProject : (slot.type === 'delegated_active' ? slot.pendingProject?.status === 'completed' : false);
            
            if (editingSlot === slot.id) {
              const kpiObj = kpis.find(k => k.id === slot.kpiId);
              const parentKpiObj = kpis.find(k => String(k.reportConfig?.followUpKpiId) === String(slot.kpiId));
              const isParentHandoff = kpiObj?.reportConfig?.handoffEnabled && kpiObj?.reportConfig?.followUpKpiId;
              const isChildHandoff = parentKpiObj?.reportConfig?.handoffEnabled;

              let parentLink = "";
              let parentDelayed = false;
              let parentDelayReason = "";
              if (isChildHandoff && slot.type === 'pending') {
                 try {
                   const meta = JSON.parse(slot.pendingProject.description);
                   parentLink = meta.parentLink || "";
                   parentDelayed = meta.parentDelayed || false;
                   parentDelayReason = meta.parentDelayReason || "";
                 } catch(e) {}
              }

              return (
                <div key={slot.id} className="bg-white rounded-3xl p-5 border border-orange-200 shadow-sm space-y-3">
                  <h3 className="text-sm font-bold text-slate-700">{slot.kpiName} - Action Details</h3>
                  
                  {isChildHandoff && parentDelayed && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3 py-2 rounded-xl text-xs font-semibold animate-pulse">
                      ⚠️ Parent Delivery Delayed: {parentDelayReason}
                    </div>
                  )}

                  {isChildHandoff && parentLink && (
                    <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Parent Deliverable:</span>
                      <a href={parentLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 underline font-bold">
                        Download / View File
                      </a>
                    </div>
                  )}

                  {!isReportingDelay ? (
                    <>
                      <div className="space-y-3 mb-4">
                        <input type="text" placeholder="Title (e.g., Onam Poster)" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300" />
                        <textarea placeholder="Objective / Notes" value={objective} onChange={(e) => setObjective(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300" rows={2} />
                        
                        {isParentHandoff && (
                          <input 
                            type="text" 
                            placeholder={kpiObj.reportConfig.parentLabel || "Google Drive Link"} 
                            value={submissionLink} 
                            onChange={(e) => setSubmissionLink(e.target.value)} 
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 font-semibold"
                          />
                        )}

                        {isChildHandoff && slot.type === 'pending' && (
                          <input 
                            type="text" 
                            placeholder={parentKpiObj.reportConfig.childLabel || "Social Media Link"} 
                            value={submissionLink} 
                            onChange={(e) => setSubmissionLink(e.target.value)} 
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 font-semibold"
                          />
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button onClick={() => {
                          if ((isParentHandoff || (isChildHandoff && slot.type === 'pending')) && !submissionLink.trim()) {
                            alert("Please provide the required submission link before completing.");
                            return;
                          }
                          onCompleteAction({ ...slot, title, objective, submissionLink });
                          setEditingSlot(null);
                          setSubmissionLink("");
                        }} className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-xl text-sm transition-colors">Mark as Completed</button>
                        
                        {isParentHandoff && (
                          <button onClick={() => setIsReportingDelay(true)} className="bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold py-2 px-4 rounded-xl text-sm transition-colors">Report Delay</button>
                        )}
                        
                        <button onClick={() => { setEditingSlot(null); setSubmissionLink(""); }} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-xl text-sm transition-colors">Cancel</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-600 block">Delay Reason</label>
                        <textarea 
                          placeholder="Why is this deliverable delayed? (e.g. Waiting for footage approval)" 
                          value={delayReason} 
                          onChange={(e) => setDelayReason(e.target.value)} 
                          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" 
                          rows={3} 
                        />
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => {
                          if (!delayReason.trim()) {
                            alert("Please enter a delay reason.");
                            return;
                          }
                          onCompleteAction({ ...slot, isDelayed: true, delayReason, title: "Delayed: " + slot.kpiName });
                          setIsReportingDelay(false);
                          setEditingSlot(null);
                          setDelayReason("");
                        }} className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded-xl text-sm transition-colors">Submit Delay</button>
                        <button onClick={() => setIsReportingDelay(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-xl text-sm transition-colors">Back</button>
                      </div>
                    </>
                  )}
                </div>
              );
            }

            return (
              <div key={slot.id} className={`rounded-3xl p-5 border ${isCompleted ? 'bg-teal-50 border-teal-100' : slot.type === 'pending' ? 'bg-amber-50 border-amber-100' : 'bg-white border-slate-200 shadow-sm'} flex items-start justify-between`}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{slot.kpiName}</span>
                    {slot.type === 'pending' && <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded flex items-center gap-1"><GitBranch className="h-3 w-3" /> Handoff</span>}
                  </div>
                  <h3 className={`text-base font-bold ${isCompleted ? 'text-teal-800' : 'text-slate-800'}`}>
                    {isCompleted ? slot.completedProject.title : slot.type === 'pending' ? slot.pendingProject.title : `Pending Action ${slot.slotIndex + 1}`}
                  </h3>
                  {isCompleted && (() => {
                    let meta = {};
                    try { meta = JSON.parse(slot.completedProject.description); } catch(e) {}
                    return (
                      <div className="mt-2 space-y-1">
                        {meta.objective && <p className="text-sm text-teal-600 font-medium">{meta.objective}</p>}
                        {meta.submissionLink && (
                          <div className="text-xs text-slate-500 mt-1">
                            <span className="font-bold">Link:</span> <a href={meta.submissionLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 underline font-semibold">{meta.submissionLink}</a>
                          </div>
                        )}
                        {meta.isDelayed && (
                          <div className="text-xs text-rose-600 mt-1 font-semibold">
                            ⚠️ Delayed: {meta.delayReason}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                  {slot.type === 'pending' && slot.pendingProject.meta.objective && <p className="text-sm text-amber-600 mt-1">{slot.pendingProject.meta.objective}</p>}
                </div>
                {!isCompleted && (
                  <button onClick={() => {
                    setEditingSlot(slot.id);
                    setTitle(slot.type === 'pending' ? slot.pendingProject.title : "");
                    setObjective(slot.type === 'pending' ? slot.pendingProject.meta.objective : "");
                  }} className="shrink-0 bg-orange-100 hover:bg-orange-200 text-orange-700 font-bold py-1.5 px-4 rounded-xl text-sm transition-colors">
                    Start Action
                  </button>
                )}
                {isCompleted && <div className="text-teal-600 font-bold text-sm bg-teal-100/50 px-3 py-1.5 rounded-xl">✓ Completed</div>}
              </div>
            );
          })
        )}
      </div>

      {/* Delegate Task Modal */}
      {showDelegateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <GitBranch className="h-5 w-5 text-teal-600" /> Delegate Task
              </h3>
              <button onClick={() => setShowDelegateModal(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Assign To</label>
                <select 
                  value={taskAssignee} 
                  onChange={(e) => setTaskAssignee(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 font-semibold bg-white"
                >
                  {assigneeOptions.map(m => (
                    <option key={m.name} value={m.name}>{m.name} ({m.teamName || 'Team'})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Task Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Design Onam Banner" 
                  value={taskTitle} 
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Target Date</label>
                  <input 
                    type="date" 
                    value={taskTargetDate} 
                    onChange={(e) => setTaskTargetDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
                  />
                </div>
                <div className="relative">
                  <label className="text-xs font-bold text-slate-600 block mb-1">Linked KPI (Optional)</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search all KPIs..."
                      value={kpiSearchQuery}
                      onFocus={() => setShowKpiDropdown(true)}
                      onChange={(e) => {
                        setKpiSearchQuery(e.target.value);
                        setShowKpiDropdown(true);
                      }}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 bg-white"
                    />
                    {taskKpiId && (
                      <span className="absolute right-8 top-2 bg-teal-50 text-teal-700 px-2 py-0.5 rounded text-[10px] font-bold">
                        Linked
                      </span>
                    )}
                    {(kpiSearchQuery || showKpiDropdown) ? (
                      <button 
                        type="button"
                        onClick={() => {
                          setTaskKpiId("");
                          setKpiSearchQuery("");
                          setShowKpiDropdown(false);
                        }}
                        className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>

                  {showKpiDropdown && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto z-50">
                      <div 
                        onClick={() => {
                          setTaskKpiId("");
                          setKpiSearchQuery("None (Independent Task)");
                          setShowKpiDropdown(false);
                        }}
                        className="px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 cursor-pointer font-semibold border-b border-slate-100"
                      >
                        None (Independent Task)
                      </div>
                      {kpis
                        .filter(k => k.name.toLowerCase().includes(kpiSearchQuery.toLowerCase()) || (k.owner && k.owner.toLowerCase().includes(kpiSearchQuery.toLowerCase())))
                        .map(k => (
                          <div
                            key={k.id}
                            onClick={() => {
                              setTaskKpiId(k.id);
                              setKpiSearchQuery(k.name);
                              setShowKpiDropdown(false);
                            }}
                            className={`px-3 py-2 text-xs hover:bg-slate-50 cursor-pointer flex flex-col gap-0.5 border-b border-slate-50 ${String(taskKpiId) === String(k.id) ? 'bg-teal-50/50' : ''}`}
                          >
                            <span className="font-bold text-slate-800">{k.name}</span>
                            <span className="text-[10px] text-slate-400 font-semibold">{k.owner} · {k.team}</span>
                          </div>
                        ))}
                      {kpis.filter(k => k.name.toLowerCase().includes(kpiSearchQuery.toLowerCase())).length === 0 && (
                        <div className="px-3 py-4 text-xs text-slate-400 italic text-center">No matching KPIs found</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Objective of the Task</label>
                <textarea 
                  placeholder="Explain why this task is needed..." 
                  value={taskObjective} 
                  onChange={(e) => setTaskObjective(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
                  rows={2}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Expected Outcome</label>
                <textarea 
                  placeholder="What is the expected deliverable/result?" 
                  value={taskOutcome} 
                  onChange={(e) => setTaskOutcome(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
                  rows={2}
                />
                {/* Repetitive Task Configuration */}
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 space-y-3 mt-3">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="isRepetitive" 
                    checked={isRepetitive}
                    onChange={(e) => {
                      setIsRepetitive(e.target.checked);
                      if (e.target.checked && !repetitiveFrequency) {
                        setRepetitiveFrequency("daily");
                      }
                    }}
                    className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
                  />
                  <label htmlFor="isRepetitive" className="text-xs font-bold text-slate-700 cursor-pointer">
                    Is this a repetitive/recurring task?
                  </label>
                </div>

                {isRepetitive && (
                  <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-200/60">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Frequency</label>
                      <select 
                        value={repetitiveFrequency} 
                        onChange={(e) => setRepetitiveFrequency(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>

                    {repetitiveFrequency === "weekly" && (
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">Select Day of Week</label>
                        <select 
                          value={weeklyDay} 
                          onChange={(e) => setWeeklyDay(e.target.value)}
                          className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                        >
                          <option value="Monday">Monday</option>
                          <option value="Tuesday">Tuesday</option>
                          <option value="Wednesday">Wednesday</option>
                          <option value="Thursday">Thursday</option>
                          <option value="Friday">Friday</option>
                          <option value="Saturday">Saturday</option>
                          <option value="Sunday">Sunday</option>
                        </select>
                      </div>
                    )}

                    {repetitiveFrequency === "monthly" && (
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">Select Day of Month</label>
                        <input 
                          type="number" 
                          min="1" 
                          max="31" 
                          value={monthlyDate} 
                          onChange={(e) => setMonthlyDate(Math.max(1, Math.min(31, parseInt(e.target.value) || 1)))}
                          className="w-full border border-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button 
                onClick={() => {
                  setShowDelegateModal(false);
                  setIsRepetitive(false);
                  setRepetitiveFrequency("");
                  setWeeklyDay("Monday");
                  setMonthlyDate(1);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (!taskTitle.trim() || !taskAssignee) {
                    alert("Please provide a title and assignee.");
                    return;
                  }
                  onCompleteAction({
                    type: 'create_delegated_task',
                    taskData: {
                      title: taskTitle,
                      assignee: taskAssignee,
                      targetDate: taskTargetDate,
                      kpiId: taskKpiId ? Number(taskKpiId) : null,
                      objective: taskObjective,
                      outcome: taskOutcome,
                      creator: user,
                      isRepetitive,
                      repetitiveConfig: isRepetitive ? {
                        frequency: repetitiveFrequency,
                        weeklyDay: repetitiveFrequency === "weekly" ? weeklyDay : null,
                        monthlyDate: repetitiveFrequency === "monthly" ? monthlyDate : null
                      } : null
                    }
                  });
                  setShowDelegateModal(false);
                  setTaskTitle("");
                  setTaskObjective("");
                  setTaskOutcome("");
                  setKpiSearchQuery("");
                  setTaskKpiId("");
                  setIsRepetitive(false);
                  setRepetitiveFrequency("");
                  setWeeklyDay("Monday");
                  setMonthlyDate(1);
                }}
                className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm"
              >
                Assign Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


/* ==================== ADD CLIENT PROJECT MODAL ==================== */

function AddClientProjectModal({ teams, project, onClose, onSubmit }) {
  const [title, setTitle] = useState(project?.title || "");
  const [description, setDescription] = useState(project?.description || "");
  const [objective, setObjective] = useState(project?.objective || "");
  const [companyDetails, setCompanyDetails] = useState(project?.companyDetails || "");
  
  // Default tree setup
  const [stages, setStages] = useState(project?.stages || [
    { 
      id: "s1",
      name: "Planning", 
      status: "current", 
      type: "sequential", 
      targetDate: "", 
      responsible: "", 
      subStages: [] 
    }
  ]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please enter a project title.");
      return;
    }
    onSubmit({
      id: project?.id || `temp-${Date.now()}`,
      title,
      description,
      objective,
      companyDetails,
      stages,
      currentStageIdx: project?.currentStageIdx || 0,
      aiChats: project?.aiChats || []
    });
  };

  const addStage = () => {
    setStages(prev => [...prev, {
      id: `s-${Date.now()}`,
      name: "",
      status: "pending",
      type: "sequential",
      targetDate: "",
      responsible: "",
      subStages: []
    }]);
  };

  const removeStage = (sId) => {
    setStages(prev => prev.filter(s => s.id !== sId));
  };

  const updateStage = (sId, fields) => {
    setStages(prev => prev.map(s => s.id === sId ? { ...s, ...fields } : s));
  };

  const addSubStage = (sId) => {
    setStages(prev => prev.map(s => {
      if (s.id !== sId) return s;
      return {
        ...s,
        subStages: [...(s.subStages || []), {
          id: `sub-${Date.now()}`,
          name: "",
          status: "pending",
          targetDate: "",
          responsible: "",
          subSubStages: []
        }]
      };
    }));
  };

  const removeSubStage = (sId, subId) => {
    setStages(prev => prev.map(s => {
      if (s.id !== sId) return s;
      return {
        ...s,
        subStages: s.subStages.filter(sub => sub.id !== subId)
      };
    }));
  };

  const updateSubStage = (sId, subId, fields) => {
    setStages(prev => prev.map(s => {
      if (s.id !== sId) return s;
      return {
        ...s,
        subStages: s.subStages.map(sub => sub.id === subId ? { ...sub, ...fields } : sub)
      };
    }));
  };

  const addSubSubStage = (sId, subId) => {
    setStages(prev => prev.map(s => {
      if (s.id !== sId) return s;
      return {
        ...s,
        subStages: s.subStages.map(sub => {
          if (sub.id !== subId) return sub;
          return {
            ...sub,
            subSubStages: [...(sub.subSubStages || []), {
              id: `subsub-${Date.now()}`,
              name: "",
              status: "pending",
              targetDate: "",
              responsible: ""
            }]
          };
        })
      };
    }));
  };

  const removeSubSubStage = (sId, subId, subSubId) => {
    setStages(prev => prev.map(s => {
      if (s.id !== sId) return s;
      return {
        ...s,
        subStages: s.subStages.map(sub => {
          if (sub.id !== subId) return sub;
          return {
            ...sub,
            subSubStages: sub.subSubStages.filter(ss => ss.id !== subSubId)
          };
        })
      };
    }));
  };

  const updateSubSubStage = (sId, subId, subSubId, fields) => {
    setStages(prev => prev.map(s => {
      if (s.id !== sId) return s;
      return {
        ...s,
        subStages: s.subStages.map(sub => {
          if (sub.id !== subId) return sub;
          return {
            ...sub,
            subSubStages: sub.subSubStages.map(ss => ss.id === subSubId ? { ...ss, ...fields } : ss)
          };
        })
      };
    }));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <form onSubmit={handleFormSubmit} className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-orange-100 flex flex-col max-h-[90vh]">
        <div className="bg-gradient-to-r from-orange-500/10 to-teal-500/10 px-6 py-4 border-b border-orange-50 flex justify-between items-center shrink-0">
          <h2 className="text-base font-bold text-slate-800" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            {project ? "Edit Build Project" : "New Build Project"}
          </h2>
          <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-600 block mb-1">Project Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. ERP Software Implementation"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-800 font-semibold"
            />
          </div>

          <div>
            <label className="font-bold text-slate-600 block mb-1">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Summary of the initiative..."
              className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-teal-500"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-600 block mb-1">Objective / Target Outcomes</label>
              <textarea
                value={objective}
                onChange={e => setObjective(e.target.value)}
                placeholder="What must be achieved..."
                className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-teal-500"
                rows={2}
              />
            </div>
            <div>
              <label className="font-bold text-slate-600 block mb-1">Company / Client Details</label>
              <textarea
                value={companyDetails}
                onChange={e => setCompanyDetails(e.target.value)}
                placeholder="Contact, requirements, address..."
                className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-teal-500"
                rows={2}
              />
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-100 pt-3">
            <div className="flex justify-between items-center">
              <label className="font-bold text-slate-700 block text-sm">Build Project Milestones &amp; Nested Stages</label>
              <button 
                type="button" 
                onClick={addStage}
                className="text-[10px] bg-teal-50 text-teal-600 border border-teal-200 font-bold px-2.5 py-1 rounded-lg hover:bg-teal-100 transition-colors"
              >
                + Add Stage
              </button>
            </div>

            <div className="space-y-4">
              {stages.map((stage, idx) => (
                <div key={stage.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3 relative">
                  <button 
                    type="button" 
                    onClick={() => removeStage(stage.id)}
                    className="absolute top-3 right-3 text-rose-500 hover:text-rose-700 font-bold text-[10px]"
                  >
                    Delete Stage
                  </button>

                  <div className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-4">
                      <label className="font-bold text-slate-500 block mb-0.5 text-[10px]">Stage {idx + 1} Name</label>
                      <input
                        type="text"
                        value={stage.name}
                        placeholder="e.g. Design & Prototype"
                        onChange={e => updateStage(stage.id, { name: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-500 font-bold"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="font-bold text-slate-500 block mb-0.5 text-[10px]">Mode</label>
                      <select
                        value={stage.type}
                        onChange={e => updateStage(stage.id, { type: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
                      >
                        <option value="sequential">Sequential</option>
                        <option value="parallel">Parallel</option>
                      </select>
                    </div>
                    <div className="col-span-3">
                      <label className="font-bold text-slate-500 block mb-0.5 text-[10px]">Target Date</label>
                      <input
                        type="date"
                        value={stage.targetDate}
                        onChange={e => updateStage(stage.id, { targetDate: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="font-bold text-slate-500 block mb-0.5 text-[10px]">Responsible</label>
                      <input
                        type="text"
                        value={stage.responsible || ""}
                        placeholder="Name"
                        onChange={e => updateStage(stage.id, { responsible: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-500 font-semibold"
                      />
                    </div>
                  </div>

                  {/* Sub-stages list */}
                  <div className="pl-6 border-l-2 border-slate-200 space-y-3 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-600 text-[10px] uppercase tracking-wider">Sub-stages</span>
                      <button 
                        type="button" 
                        onClick={() => addSubStage(stage.id)}
                        className="text-[9px] bg-slate-100 hover:bg-slate-200 border border-slate-300 font-bold px-2 py-0.5 rounded"
                      >
                        + Add Sub-stage
                      </button>
                    </div>

                    {stage.subStages?.map((sub, sIdx) => (
                      <div key={sub.id} className="bg-white border border-slate-150 rounded-xl p-3 space-y-2 relative">
                        <button 
                          type="button" 
                          onClick={() => removeSubStage(stage.id, sub.id)}
                          className="absolute top-2 right-2 text-rose-500 hover:text-rose-700 text-[9px]"
                        >
                          ✕
                        </button>
                        
                        <div className="grid grid-cols-12 gap-2 items-center">
                          <div className="col-span-5">
                            <label className="text-[9px] font-bold text-slate-400 block mb-0.5">Sub-stage {sIdx + 1}</label>
                            <input
                              type="text"
                              value={sub.name}
                              placeholder="e.g. UI/UX Wireframes"
                              onChange={e => updateSubStage(stage.id, sub.id, { name: e.target.value })}
                              className="w-full border border-slate-200 rounded-lg px-2 py-1 text-[11px] focus:outline-none font-semibold"
                            />
                          </div>
                          <div className="col-span-3">
                            <label className="text-[9px] font-bold text-slate-400 block mb-0.5">Target Date</label>
                            <input
                              type="date"
                              value={sub.targetDate}
                              onChange={e => updateSubStage(stage.id, sub.id, { targetDate: e.target.value })}
                              className="w-full border border-slate-200 rounded-lg px-2 py-0.5 text-[11px] focus:outline-none"
                            />
                          </div>
                          <div className="col-span-4">
                            <label className="text-[9px] font-bold text-slate-400 block mb-0.5">Responsible</label>
                            <input
                              type="text"
                              value={sub.responsible || ""}
                              placeholder="Name"
                              onChange={e => updateSubStage(stage.id, sub.id, { responsible: e.target.value })}
                              className="w-full border border-slate-200 rounded-lg px-2 py-1 text-[11px] focus:outline-none font-medium"
                            />
                          </div>
                        </div>

                        {/* Sub-sub stages */}
                        <div className="pl-4 border-l border-dashed border-slate-300 space-y-2 pt-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-bold text-slate-500">Sub-sub-stages</span>
                            <button 
                              type="button" 
                              onClick={() => addSubSubStage(stage.id, sub.id)}
                              className="text-[8px] bg-slate-50 hover:bg-slate-100 border border-slate-200 font-bold px-1.5 py-0.5 rounded"
                            >
                              + Add Sub-sub
                            </button>
                          </div>

                          {sub.subSubStages?.map((ss, ssIdx) => (
                            <div key={ss.id} className="flex gap-2 items-center bg-slate-50/50 p-1.5 rounded-lg border border-slate-100 relative pr-6">
                              <input
                                type="text"
                                value={ss.name}
                                placeholder={`Sub-sub-stage ${ssIdx + 1}`}
                                onChange={e => updateSubSubStage(stage.id, sub.id, ss.id, { name: e.target.value })}
                                className="flex-1 border border-slate-200 rounded-lg px-2 py-0.5 text-[10px] focus:outline-none"
                              />
                              <input
                                type="date"
                                value={ss.targetDate}
                                onChange={e => updateSubSubStage(stage.id, sub.id, ss.id, { targetDate: e.target.value })}
                                className="border border-slate-200 rounded-lg px-2 py-0.5 text-[10px] focus:outline-none"
                              />
                              <input
                                type="text"
                                value={ss.responsible || ""}
                                placeholder="Responsible"
                                onChange={e => updateSubSubStage(stage.id, sub.id, ss.id, { responsible: e.target.value })}
                                className="w-24 border border-slate-200 rounded-lg px-2 py-0.5 text-[10px] focus:outline-none"
                              />
                              <button 
                                type="button" 
                                onClick={() => removeSubSubStage(stage.id, sub.id, ss.id)}
                                className="absolute right-1.5 text-rose-500 hover:text-rose-700 font-bold text-[9px]"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>

                      </div>
                    ))}
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-end gap-2 shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-200 hover:bg-slate-100 font-bold rounded-xl transition-colors">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl transition-colors">
            Save Project
          </button>
        </div>
      </form>
    </div>
  );
}


/* ==================== CLIENT PROJECT WORKSPACE MODAL ==================== */

function ClientProjectWorkspaceModal({ project, kpis, teams, onClose, onUpdateProject, onAddTask, clientProjectLogs, onAddClientProjectLog }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [logText, setLogText] = useState("");
  const [promptText, setPromptText] = useState("");
  const [isDebating, setIsDebating] = useState(false);
  const [debateHistory, setDebateHistory] = useState(project.aiChats || []);
  const [newObjective, setNewObjective] = useState(project.objective || "");
  const [newCompanyDetails, setNewCompanyDetails] = useState(project.companyDetails || "");
  const [attachmentName, setAttachmentName] = useState("");
  const [isEditingMeta, setIsEditingMeta] = useState(false);

  const currentStage = project.stages[project.currentStageIdx] || { name: "Planning", status: "current" };

  const projectLogs = (clientProjectLogs || []).filter(l => l.projectId === project.id);

  const handleSaveMeta = () => {
    onUpdateProject({
      ...project,
      objective: newObjective,
      companyDetails: newCompanyDetails
    });
    setIsEditingMeta(false);
  };

  const handleAddLog = (e) => {
    e.preventDefault();
    if (!logText.trim()) return;
    onAddClientProjectLog(project.id, logText.trim());
    setLogText("");
  };

  const handleAddAttachment = (e) => {
    e.preventDefault();
    if (!attachmentName.trim()) return;
    const newAttach = {
      name: attachmentName.trim(),
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      size: "Placeholder Mock Size"
    };
    const updatedAttach = [...(project.attachments || []), newAttach];
    onUpdateProject({
      ...project,
      attachments: updatedAttach
    });
    setAttachmentName("");
  };

  const triggerAIDebate = () => {
    if (!promptText.trim()) return;
    setIsDebating(true);
    
    const userPrompt = promptText.trim();
    
    // Simulate multi-agent discussion sequence (Claude -> Gemini -> OpenAI)
    setTimeout(() => {
      const claudeResp = {
        agent: "Claude (Anthropic)",
        avatarBg: "bg-orange-500",
        text: `Based on architectural integrity and structured logic for the stage "${currentStage.name}", I propose defining a clear separation of concerns. We must catalog the specific bottlenecks here, design an optimized pipeline pattern, and implement automated verification tests. Specifically for: "${userPrompt}".`
      };
      setDebateHistory(prev => [...prev, { type: "user", text: userPrompt }, claudeResp]);

      setTimeout(() => {
        const geminiResp = {
          agent: "Gemini Pro (Google)",
          avatarBg: "bg-blue-500",
          text: `Adding to Claude's points, looking at the wider context of this KPI project and client goals: We can leverage multi-modal context windows here. We should look at past metrics trends to auto-adjust targets, check external factors like holidays, and generate a dynamic execution overview. I suggest adding interactive visual charts for this stage.`
        };
        setDebateHistory(prev => [...prev, geminiResp]);

        setTimeout(() => {
          const openaiResp = {
            agent: "OpenAI GPT-4o",
            avatarBg: "bg-emerald-500",
            text: `Combining the structure from Claude and Gemini, here is the finalized action plan: \n\n1. Define stage schema and validation metrics.\n2. Leverage automated scripting to resolve the bottleneck.\n3. Spin up targeted checklists for assignee.\n\nShall we export this proposal directly to team tasks?`
          };
          const finalHistory = [...debateHistory, { type: "user", text: userPrompt }, claudeResp, geminiResp, openaiResp];
          setDebateHistory(finalHistory);
          onUpdateProject({
            ...project,
            aiChats: finalHistory
          });
          setIsDebating(false);
          setPromptText("");
        }, 1200);
      }, 1000);
    }, 800);
  };

  const handleExportAITasks = () => {
    onAddTask({
      title: `[AI RESOLUTION] Stage: ${currentStage.name}`,
      assignee: project.leadName || "Unassigned",
      targetDate: project.targetDate || new Date().toISOString().split('T')[0],
      kpiId: project.linkedKpiIds?.[0] || null,
      objective: `Resolving: ${currentStage.name} objective`,
      outcome: `Implement stage schema validation & automated bottleneck resolution scripts.`,
      creator: "AI Consultation Chamber"
    });
    alert("AI Resolution plan tasks successfully exported and assigned to project lead!");
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden border border-orange-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500/10 to-teal-500/10 px-6 py-4 flex items-center justify-between border-b border-orange-50 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500 text-white uppercase tracking-wider">Project Workspace</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-orange-100 text-orange-700">Stage: {currentStage.name}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-800 mt-1" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>{project.title}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-100 bg-slate-50/50 shrink-0 px-6">
          {["overview", "stages", "daily_logs", "ai_chamber"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-4 font-bold text-xs uppercase tracking-wider border-b-2 -mb-px transition-all ${
                activeTab === tab 
                  ? "border-teal-500 text-teal-600 font-extrabold" 
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab === "overview" && "📋 Project Details"}
              {tab === "stages" && "📈 Objective Stages"}
              {tab === "daily_logs" && "📰 Daily Log"}
              {tab === "ai_chamber" && "🤖 AI Debate chamber"}
            </button>
          ))}
        </div>

        {/* Workspace Body */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0 bg-slate-50/20">
          
          {/* TAB: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Project Target &amp; Company Metadata</h3>
                  <button 
                    onClick={() => { if (isEditingMeta) handleSaveMeta(); else setIsEditingMeta(true); }}
                    className="text-xs font-semibold text-teal-600 hover:underline"
                  >
                    {isEditingMeta ? "Save Changes" : "Edit Metadata"}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Objective / Goals</label>
                    {isEditingMeta ? (
                      <textarea 
                        value={newObjective}
                        onChange={e => setNewObjective(e.target.value)}
                        className="w-full text-xs border border-slate-200 rounded-xl p-2 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                        rows={3}
                      />
                    ) : (
                      <p className="text-xs text-slate-600 bg-slate-50 rounded-xl p-3 border border-slate-100 whitespace-pre-wrap">{project.objective || "No objective set yet. Click Edit Metadata to set one."}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Company / Client Details</label>
                    {isEditingMeta ? (
                      <textarea 
                        value={newCompanyDetails}
                        onChange={e => setNewCompanyDetails(e.target.value)}
                        className="w-full text-xs border border-slate-200 rounded-xl p-2 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                        rows={3}
                      />
                    ) : (
                      <p className="text-xs text-slate-600 bg-slate-50 rounded-xl p-3 border border-slate-100 whitespace-pre-wrap">{project.companyDetails || "No company details set yet. Click Edit to customize."}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Attachments Section */}
              <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Attachments &amp; Files</h3>
                
                <form onSubmit={handleAddAttachment} className="flex gap-2">
                  <input
                    type="text"
                    value={attachmentName}
                    onChange={e => setAttachmentName(e.target.value)}
                    placeholder="Enter file name (e.g. DesignSpecs.pdf, Mockups.zip)"
                    className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                  <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors shrink-0">
                    Add File
                  </button>
                </form>

                <div className="divide-y divide-slate-100">
                  {(project.attachments || []).map((attach, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 text-xs">
                      <span className="font-semibold text-slate-700">📂 {attach.name}</span>
                      <span className="text-[10px] text-slate-400">{attach.date}</span>
                    </div>
                  ))}
                  {(!project.attachments || project.attachments.length === 0) && (
                    <p className="text-xs text-slate-400 italic text-center py-4">No attachments linked yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: STAGES */}
          {activeTab === "stages" && (
            <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm space-y-6">
              <h3 className="text-sm font-bold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Hierarchical Milestones &amp; Responsible Owners</h3>
              <div className="space-y-4">
                {project.stages.map((stage, idx) => {
                  const isCurrent = idx === project.currentStageIdx;
                  const isCompleted = stage.status === "completed";
                  return (
                    <div key={stage.id || idx} className={`p-4 rounded-2xl border transition-all flex flex-col gap-3 ${
                      isCurrent 
                        ? "bg-orange-50/50 border-orange-200 shadow-sm" 
                        : isCompleted 
                          ? "bg-teal-50/20 border-teal-100" 
                          : "bg-slate-50/20 border-slate-150"
                    }`}>
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                              isCompleted 
                                ? "bg-teal-100 text-teal-700" 
                                : isCurrent 
                                  ? "bg-orange-100 text-orange-700" 
                                  : "bg-slate-100 text-slate-500"
                            }`}>
                              Stage {idx + 1}: {stage.status} ({stage.type || "sequential"})
                            </span>
                            {stage.targetDate && <span className="text-[10px] text-slate-400">Target: {stage.targetDate}</span>}
                            {stage.responsible && <span className="text-[10px] text-teal-600 font-bold">Resp: {stage.responsible}</span>}
                          </div>
                          <h4 className="text-sm font-bold text-slate-800">{stage.name}</h4>
                        </div>

                        <button
                          onClick={() => {
                            const nextStatus = isCompleted ? "current" : "completed";
                            const updated = project.stages.map((s, sIdx) => {
                              if (sIdx === idx) return { ...s, status: nextStatus };
                              if (nextStatus === "current" && s.status === "current") {
                                return { ...s, status: sIdx < idx ? "completed" : "pending" };
                              }
                              return s;
                            });
                            onUpdateProject({
                              ...project,
                              stages: updated,
                              currentStageIdx: nextStatus === "current" ? idx : project.currentStageIdx
                            });
                          }}
                          className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border transition-colors ${
                            isCompleted
                              ? "bg-teal-50 border-teal-200 text-teal-700"
                              : isCurrent
                                ? "bg-orange-50 border-orange-200 text-orange-700"
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {isCompleted ? "Completed ✓" : isCurrent ? "Active Stage" : "Set Active"}
                        </button>
                      </div>

                      {/* Sub stages display list */}
                      {stage.subStages && stage.subStages.length > 0 && (
                        <div className="pl-6 border-l-2 border-slate-200 space-y-3 mt-1">
                          {stage.subStages.map((sub, sIdx) => (
                            <div key={sub.id || sIdx} className="bg-white border border-slate-150 rounded-xl p-3 space-y-2">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-slate-700">Sub-stage {sIdx + 1}: {sub.name}</span>
                                <div className="flex gap-2 text-[10px]">
                                  {sub.targetDate && <span className="text-slate-400">Target: {sub.targetDate}</span>}
                                  {sub.responsible && <span className="text-teal-600 font-bold">Resp: {sub.responsible}</span>}
                                </div>
                              </div>

                              {/* Sub-sub stages display list */}
                              {sub.subSubStages && sub.subSubStages.length > 0 && (
                                <div className="pl-4 border-l border-dashed border-slate-250 space-y-1.5 pt-1">
                                  {sub.subSubStages.map((ss, ssIdx) => (
                                    <div key={ss.id || ssIdx} className="flex justify-between items-center text-[10px] bg-slate-50/50 px-2.5 py-1.5 rounded border border-slate-100">
                                      <span className="font-semibold text-slate-600">↳ {ss.name}</span>
                                      <div className="flex gap-2">
                                        {ss.targetDate && <span className="text-slate-400">Target: {ss.targetDate}</span>}
                                        {ss.responsible && <span className="text-teal-600 font-bold">Resp: {ss.responsible}</span>}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: DAILY LOGS */}
          {activeTab === "daily_logs" && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Add Log Update</h3>
                <form onSubmit={handleAddLog} className="space-y-3">
                  <textarea
                    value={logText}
                    onChange={e => setLogText(e.target.value)}
                    placeholder="Describe today's achievements, updates or blockers..."
                    className="w-full text-xs border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors">
                      Post Entry
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Log History</h3>
                <div className="relative border-l-2 border-slate-100 pl-4 space-y-6">
                  {projectLogs.map((log, idx) => (
                    <div key={log.id || idx} className="relative">
                      <div className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-teal-500 ring-4 ring-white" />
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-slate-700">{log.author}</span>
                          <span className="text-[10px] text-slate-400">{log.date}</span>
                        </div>
                        <p className="text-xs text-slate-600">{log.text}</p>
                      </div>
                    </div>
                  ))}
                  {projectLogs.length === 0 && (
                    <p className="text-xs text-slate-400 italic text-center py-4">No daily logs registered yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: AI CHAMBER */}
          {activeTab === "ai_chamber" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-teal-500/5 to-purple-500/5 border border-slate-150 rounded-2xl p-5 shadow-sm space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>🤖 LLM Collaboration panel</h3>
                  <p className="text-xs text-slate-500 mt-1">Prompt Claude, Gemini, and OpenAI to debate and synthesize the ideal outcome for your active milestone bottleneck.</p>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promptText}
                    onChange={e => setPromptText(e.target.value)}
                    placeholder="Enter bottleneck or problem (e.g. need to test 100 features in 2 days)"
                    className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                    disabled={isDebating}
                  />
                  <button
                    onClick={triggerAIDebate}
                    disabled={isDebating || !promptText.trim()}
                    className="bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-600 hover:to-indigo-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all disabled:opacity-50 shrink-0"
                  >
                    {isDebating ? "Agents debating..." : "Consult Agents"}
                  </button>
                </div>
              </div>

              {/* Chat Thread */}
              <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm space-y-4 flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Agents Debate Transcript</h3>
                  {debateHistory.length > 0 && (
                    <button
                      onClick={handleExportAITasks}
                      className="text-[10px] font-bold bg-teal-50 text-teal-600 border border-teal-100 hover:bg-teal-100 px-3 py-1.5 rounded-xl transition-colors"
                    >
                      Export Resolution Plan to Task list
                    </button>
                  )}
                </div>

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  {debateHistory.map((msg, idx) => {
                    const isUser = msg.type === "user";
                    return (
                      <div key={idx} className={`flex gap-3 items-start ${isUser ? "justify-end" : "justify-start"}`}>
                        {!isUser && (
                          <div className={`h-8 w-8 rounded-full ${msg.avatarBg} text-white flex items-center justify-center font-black text-xs shrink-0`}>
                            {msg.agent.charAt(0)}
                          </div>
                        )}
                        <div className={`p-3 rounded-2xl text-xs max-w-[80%] ${
                          isUser 
                            ? "bg-teal-500 text-white" 
                            : "bg-slate-50 border border-slate-100 text-slate-700"
                        }`}>
                          {!isUser && <p className="font-bold text-[10px] mb-1 text-slate-400">{msg.agent}</p>}
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                      </div>
                    );
                  })}
                  {debateHistory.length === 0 && (
                    <p className="text-xs text-slate-400 italic text-center py-10">Consult the debate panel above to populate agent discussions.</p>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

function ActiveProjectWorkspaceModal({ project, kpis, teams, onClose, onUpdateProject, onAddTask }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [logText, setLogText] = useState("");
  const [promptText, setPromptText] = useState("");
  const [isDebating, setIsDebating] = useState(false);
  const [debateHistory, setDebateHistory] = useState(project.aiChats || []);
  const [newObjective, setNewObjective] = useState(project.objective || "");
  const [newCompanyDetails, setNewCompanyDetails] = useState(project.companyDetails || "");
  const [attachmentName, setAttachmentName] = useState("");
  const [isEditingMeta, setIsEditingMeta] = useState(false);

  const currentStage = project.stages[project.currentStageIdx] || { name: "Planning", status: "current" };

  const handleSaveMeta = () => {
    onUpdateProject({
      ...project,
      objective: newObjective,
      companyDetails: newCompanyDetails
    });
    setIsEditingMeta(false);
  };

  const handleAddLog = (e) => {
    e.preventDefault();
    if (!logText.trim()) return;
    const newLog = {
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      text: logText.trim(),
      author: "Admin"
    };
    const updatedLogs = [newLog, ...(project.dailyLogs || [])];
    onUpdateProject({
      ...project,
      dailyLogs: updatedLogs
    });
    setLogText("");
  };

  const handleAddAttachment = (e) => {
    e.preventDefault();
    if (!attachmentName.trim()) return;
    const newAttach = {
      name: attachmentName.trim(),
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      size: "Placeholder Mock Size"
    };
    const updatedAttach = [...(project.attachments || []), newAttach];
    onUpdateProject({
      ...project,
      attachments: updatedAttach
    });
    setAttachmentName("");
  };

  const triggerAIDebate = () => {
    if (!promptText.trim()) return;
    setIsDebating(true);
    
    const userPrompt = promptText.trim();
    
    // Simulate multi-agent discussion sequence (Claude -> Gemini -> OpenAI)
    setTimeout(() => {
      const claudeResp = {
        agent: "Claude (Anthropic)",
        avatarBg: "bg-orange-500",
        text: `Based on architectural integrity and structured logic for the stage "${currentStage.name}", I propose defining a clear separation of concerns. We must catalog the specific bottlenecks here, design an optimized pipeline pattern, and implement automated verification tests. Specifically for: "${userPrompt}".`
      };
      setDebateHistory(prev => [...prev, { type: "user", text: userPrompt }, claudeResp]);

      setTimeout(() => {
        const geminiResp = {
          agent: "Gemini Pro (Google)",
          avatarBg: "bg-blue-500",
          text: `Adding to Claude's points, looking at the wider context of this KPI project and client goals: We can leverage multi-modal context windows here. We should look at past metrics trends to auto-adjust targets, check external factors like holidays, and generate a dynamic execution overview. I suggest adding interactive visual charts for this stage.`
        };
        setDebateHistory(prev => [...prev, geminiResp]);

        setTimeout(() => {
          const openaiResp = {
            agent: "OpenAI GPT-4o",
            avatarBg: "bg-emerald-500",
            text: `Combining the structure from Claude and Gemini, here is the finalized action plan: \n\n1. Define stage schema and validation metrics.\n2. Leverage automated scripting to resolve the bottleneck.\n3. Spin up targeted checklists for assignee.\n\nShall we export this proposal directly to team tasks?`
          };
          const finalHistory = [...debateHistory, { type: "user", text: userPrompt }, claudeResp, geminiResp, openaiResp];
          setDebateHistory(finalHistory);
          onUpdateProject({
            ...project,
            aiChats: finalHistory
          });
          setIsDebating(false);
          setPromptText("");
        }, 1200);
      }, 1000);
    }, 800);
  };

  const handleExportAITasks = () => {
    // Generate tasks out of OpenAI's plan
    onAddTask({
      title: `[AI RESOLUTION] Stage: ${currentStage.name}`,
      assignee: project.leadName || "Unassigned",
      targetDate: project.targetDate || new Date().toISOString().split('T')[0],
      kpiId: project.linkedKpiIds?.[0] || null,
      objective: `Resolving: ${currentStage.name} objective`,
      outcome: `Implement stage schema validation & automated bottleneck resolution scripts.`,
      creator: "AI Consultation Chamber"
    });
    alert("AI Resolution plan tasks successfully exported and assigned to project lead!");
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden border border-orange-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500/10 to-teal-500/10 px-6 py-4 flex items-center justify-between border-b border-orange-50 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500 text-white uppercase tracking-wider">Project Workspace</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-orange-100 text-orange-700">Stage: {currentStage.name}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-800 mt-1" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>{project.title}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-100 bg-slate-50/50 shrink-0 px-6">
          {["overview", "stages", "daily_logs", "ai_chamber"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-4 font-bold text-xs uppercase tracking-wider border-b-2 -mb-px transition-all ${
                activeTab === tab 
                  ? "border-teal-500 text-teal-600 font-extrabold" 
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab === "overview" && "📋 Project Details"}
              {tab === "stages" && "📈 Objective Stages"}
              {tab === "daily_logs" && "📰 Daily Log"}
              {tab === "ai_chamber" && "🤖 AI Debate chamber"}
            </button>
          ))}
        </div>

        {/* Workspace Body */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0 bg-slate-50/20">
          
          {/* TAB: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Project Target &amp; Company Metadata</h3>
                  <button 
                    onClick={() => { if (isEditingMeta) handleSaveMeta(); else setIsEditingMeta(true); }}
                    className="text-xs font-semibold text-teal-600 hover:underline"
                  >
                    {isEditingMeta ? "Save Changes" : "Edit Metadata"}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Objective / Goals</label>
                    {isEditingMeta ? (
                      <textarea 
                        value={newObjective}
                        onChange={e => setNewObjective(e.target.value)}
                        className="w-full text-xs border border-slate-200 rounded-xl p-2 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                        rows={3}
                      />
                    ) : (
                      <p className="text-xs text-slate-600 bg-slate-50 rounded-xl p-3 border border-slate-100 whitespace-pre-wrap">{project.objective || "No objective set yet. Click Edit Metadata to set one."}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Company / Client Details</label>
                    {isEditingMeta ? (
                      <textarea 
                        value={newCompanyDetails}
                        onChange={e => setNewCompanyDetails(e.target.value)}
                        className="w-full text-xs border border-slate-200 rounded-xl p-2 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                        rows={3}
                      />
                    ) : (
                      <p className="text-xs text-slate-600 bg-slate-50 rounded-xl p-3 border border-slate-100 whitespace-pre-wrap">{project.companyDetails || "No company details set yet. Click Edit to customize."}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Attachments Section */}
              <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Attachments &amp; Files</h3>
                
                <form onSubmit={handleAddAttachment} className="flex gap-2">
                  <input
                    type="text"
                    value={attachmentName}
                    onChange={e => setAttachmentName(e.target.value)}
                    placeholder="Enter file name (e.g. DesignSpecs.pdf, Mockups.zip)"
                    className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                  <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors shrink-0">
                    Add File
                  </button>
                </form>

                <div className="divide-y divide-slate-100">
                  {(project.attachments || []).map((attach, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 text-xs">
                      <span className="font-semibold text-slate-700">📂 {attach.name}</span>
                      <span className="text-[10px] text-slate-400">{attach.date}</span>
                    </div>
                  ))}
                  {(!project.attachments || project.attachments.length === 0) && (
                    <p className="text-xs text-slate-400 italic text-center py-4">No attachments linked yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: STAGES */}
          {activeTab === "stages" && (
            <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm space-y-6">
              <h3 className="text-sm font-bold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Stages and Stage Objectives</h3>
              <div className="space-y-4">
                {project.stages.map((stage, idx) => {
                  const isCurrent = idx === project.currentStageIdx;
                  const isCompleted = stage.status === "completed";
                  return (
                    <div key={idx} className={`p-4 rounded-2xl border transition-all flex justify-between items-start ${
                      isCurrent 
                        ? "bg-orange-50/50 border-orange-200 shadow-sm" 
                        : isCompleted 
                          ? "bg-teal-50/20 border-teal-100" 
                          : "bg-slate-50/20 border-slate-150"
                    }`}>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            isCompleted 
                              ? "bg-teal-100 text-teal-700" 
                              : isCurrent 
                                ? "bg-orange-100 text-orange-700" 
                                : "bg-slate-100 text-slate-500"
                          }`}>
                            Stage {idx + 1}: {stage.status}
                          </span>
                          <span className="text-[10px] text-slate-400">Target: {stage.targetDate}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-800">{stage.name}</h4>
                        <p className="text-xs text-slate-500 mt-1">{stage.objective || "Deliver milestone deliverables according to target checklist specifications."}</p>
                      </div>

                      <button
                        onClick={() => {
                          const nextStatus = isCompleted ? "current" : "completed";
                          const updated = project.stages.map((s, sIdx) => {
                            if (sIdx === idx) return { ...s, status: nextStatus };
                            if (nextStatus === "current" && s.status === "current") {
                              return { ...s, status: sIdx < idx ? "completed" : "pending" };
                            }
                            return s;
                          });
                          onUpdateProject({
                            ...project,
                            stages: updated,
                            currentStageIdx: nextStatus === "current" ? idx : project.currentStageIdx
                          });
                        }}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors ${
                          isCompleted
                            ? "bg-teal-50 border-teal-200 text-teal-700"
                            : isCurrent
                              ? "bg-orange-50 border-orange-200 text-orange-700"
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {isCompleted ? "Completed ✓" : isCurrent ? "Active Stage" : "Set Active"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: DAILY LOGS */}
          {activeTab === "daily_logs" && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Add Log Update</h3>
                <form onSubmit={handleAddLog} className="space-y-3">
                  <textarea
                    value={logText}
                    onChange={e => setLogText(e.target.value)}
                    placeholder="Describe today's achievements, updates or blockers..."
                    className="w-full text-xs border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors">
                      Post Entry
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Log History</h3>
                <div className="relative border-l-2 border-slate-100 pl-4 space-y-6">
                  {(project.dailyLogs || []).map((log, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-teal-500 ring-4 ring-white" />
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-slate-700">{log.author}</span>
                          <span className="text-[10px] text-slate-400">{log.date}</span>
                        </div>
                        <p className="text-xs text-slate-600">{log.text}</p>
                      </div>
                    </div>
                  ))}
                  {(!project.dailyLogs || project.dailyLogs.length === 0) && (
                    <p className="text-xs text-slate-400 italic text-center py-4">No daily logs registered yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: AI CHAMBER */}
          {activeTab === "ai_chamber" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-teal-500/5 to-purple-500/5 border border-slate-150 rounded-2xl p-5 shadow-sm space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>🤖 LLM Collaboration panel</h3>
                  <p className="text-xs text-slate-500 mt-1">Prompt Claude, Gemini, and OpenAI to debate and synthesize the ideal outcome for your active milestone bottleneck.</p>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promptText}
                    onChange={e => setPromptText(e.target.value)}
                    placeholder="Enter bottleneck or problem (e.g. need to test 100 features in 2 days)"
                    className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                    disabled={isDebating}
                  />
                  <button
                    onClick={triggerAIDebate}
                    disabled={isDebating || !promptText.trim()}
                    className="bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-600 hover:to-indigo-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all disabled:opacity-50 shrink-0"
                  >
                    {isDebating ? "Agents debating..." : "Consult Agents"}
                  </button>
                </div>
              </div>

              {/* Chat Thread */}
              <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm space-y-4 flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Agents Debate Transcript</h3>
                  {debateHistory.length > 0 && (
                    <button
                      onClick={handleExportAITasks}
                      className="text-[10px] font-bold bg-teal-50 text-teal-600 border border-teal-100 hover:bg-teal-100 px-3 py-1.5 rounded-xl transition-colors"
                    >
                      Export Resolution Plan to Task list
                    </button>
                  )}
                </div>

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  {debateHistory.map((msg, idx) => {
                    const isUser = msg.type === "user";
                    return (
                      <div key={idx} className={`flex gap-3 items-start ${isUser ? "justify-end" : "justify-start"}`}>
                        {!isUser && (
                          <div className={`h-8 w-8 rounded-full ${msg.avatarBg} text-white flex items-center justify-center font-black text-xs shrink-0`}>
                            {msg.agent.charAt(0)}
                          </div>
                        )}
                        <div className={`p-3 rounded-2xl text-xs max-w-[80%] ${
                          isUser 
                            ? "bg-teal-500 text-white" 
                            : "bg-slate-50 border border-slate-100 text-slate-700"
                        }`}>
                          {!isUser && <p className="font-bold text-[10px] mb-1 text-slate-400">{msg.agent}</p>}
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                      </div>
                    );
                  })}
                  {debateHistory.length === 0 && (
                    <p className="text-xs text-slate-400 italic text-center py-10">Consult the debate panel above to populate agent discussions.</p>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

/* ==================== ANIMATED COUNT UP/DOWN COMPONENT ==================== */
function AnimatedCounter({ value, duration = 400 }) {
  const [displayValue, setDisplayValue] = React.useState(value);

  React.useEffect(() => {
    let startTimestamp = null;
    const startValue = displayValue;
    const endValue = parseFloat(value) || 0;
    
    // If numbers match, skip animating
    if (startValue === endValue) return;

    let animationFrameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const current = startValue + progress * (endValue - startValue);
      
      // Keep decimals clean (match precision)
      if (Number.isInteger(endValue) && Number.isInteger(startValue)) {
        setDisplayValue(Math.round(current));
      } else {
        setDisplayValue(Math.round(current * 100) / 100);
      }

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setDisplayValue(endValue);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [value]);

  return <span>{displayValue}</span>;
}

/* ==================== DAILY TARGET EVALUATION ENGINE ==================== */
function getDailyTargetInfo(kpi, selectedDateStr) {
  const dailyAlloc = kpi.dailyAlloc || {};
  const dailyActual = kpi.dailyActual || {};
  const targetDate = new Date(selectedDateStr);

  // 1. Get target for the selected date
  let dispTarget = dailyAlloc[selectedDateStr] ?? 0;
  let upcomingInfo = null;

  // If no target is set for selected date, find the next upcoming target date
  if (dispTarget === 0) {
    let minDiff = Infinity;
    let nextDateStr = null;
    
    Object.keys(dailyAlloc).forEach(dStr => {
      const d = new Date(dStr);
      if (d > targetDate) {
        const diffTime = d - targetDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < minDiff && dailyAlloc[dStr] > 0) {
          minDiff = diffDays;
          nextDateStr = dStr;
        }
      }
    });

    if (nextDateStr) {
      dispTarget = dailyAlloc[nextDateStr];
      upcomingInfo = `in ${minDiff} day${minDiff > 1 ? 's' : ''}`;
    }
  }

  // 2. Calculate sum of pending targets (previous targets that were not met)
  let pendingSum = 0;
  Object.keys(dailyAlloc).forEach(dStr => {
    const d = new Date(dStr);
    if (d < targetDate) {
      const targetVal = dailyAlloc[dStr] || 0;
      const actualVal = dailyActual[dStr] || 0;
      if (kpi.direction === "higher") {
        if (actualVal < targetVal) {
          pendingSum += (targetVal - actualVal);
        }
      } else {
        if (actualVal > targetVal) {
          pendingSum += (actualVal - targetVal);
        }
      }
    }
  });

  return {
    target: dispTarget,
    upcomingInfo,
    pendingSum: pendingSum > 0 ? Math.round(pendingSum * 100) / 100 : 0
  };
}


/* ==================== ADMIN APP ==================== */

const ADMIN_NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "action", label: "Action Screen", icon: ListTodo },
  { id: "kpis", label: "KPIs", icon: Target },
  { id: "review", label: "Morning Review", icon: Coffee },
  { id: "okrs", label: "OKRs", icon: TrendingUp },
  { id: "build_projects", label: "Build Projects", icon: FolderGit2 },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "campaigns", label: "Campaigns", icon: Megaphone },
  { id: "settings", label: "Settings", icon: Settings },
];

function MorningReviewScreen({ teams, kpis }) {
  const [selectedMember, setSelectedMember] = useState(null);
  
  // Flatten members list and sort alphabetically
  const allMembers = useMemo(() => {
    return teams.flatMap(t => t.members.map(m => ({ ...m, teamName: t.name })))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [teams]);

  // Determine current dates
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  // Find current monthName and weekId
  let currentMonthName = "";
  let currentWeekId = "";
  for (let m of MONTHS_LIST) {
    const cells = getCalendarCells(m);
    if (cells.some(c => c && c.dateStr === todayStr)) {
      currentMonthName = m;
      const numRows = Math.ceil(cells.length / 7);
      for (let r = 0; r < numRows; r++) {
        const weekDays = getDaysInWeekRow(m, r);
        if (weekDays.includes(todayStr)) {
          currentWeekId = `${m}-Week${r + 1}`;
          break;
        }
      }
      break;
    }
  }

  // Next month logic
  let nextMonthName = "";
  if (today.getDate() >= 28 && currentMonthName) {
    const idx = MONTHS_LIST.indexOf(currentMonthName);
    if (idx >= 0 && idx < MONTHS_LIST.length - 1) {
      nextMonthName = MONTHS_LIST[idx + 1];
    }
  }

  // Support Notes state
  const [notes, setNotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('morning_review_notes')) || {};
    } catch {
      return {};
    }
  });

  const handleNotesChange = (memberId, text) => {
    const newNotes = { ...notes, [memberId]: text };
    setNotes(newNotes);
    localStorage.setItem('morning_review_notes', JSON.stringify(newNotes));
  };

  if (!selectedMember) {
    return (
      <div className="flex-1 flex flex-col h-full bg-slate-50 relative overflow-hidden">
        <div className="bg-white border-b border-orange-100 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm z-10">
          <div>
            <h1 className="text-xl font-bold text-slate-800" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Morning Review</h1>
            <p className="text-xs text-slate-500 font-medium">Daily team follow-ups & deliverables</p>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allMembers.map(m => (
              <button 
                key={m.id || m.name}
                onClick={() => setSelectedMember(m)}
                className="bg-white border border-slate-200 hover:border-teal-400 hover:shadow-md rounded-2xl p-4 text-left transition-all group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold group-hover:bg-teal-100 group-hover:text-teal-600 transition-colors">
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">{m.name}</h3>
                    <p className="text-xs text-slate-500">{m.teamName}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Get deliverables for the selected member
  const memberKpis = kpis.filter(k => k.owner === selectedMember.name);
  
  const dailyKpis = memberKpis.filter(k => k.dailyAlloc?.[todayStr] > 0 || k.dailyActual?.[todayStr] > 0);
  const weeklyKpis = memberKpis.filter(k => currentWeekId && (k.weeklyAlloc?.[currentWeekId] > 0 || k.weeklyActual?.[currentWeekId] > 0));
  const nextMonthKpis = nextMonthName ? memberKpis.filter(k => k.monthlyAlloc?.[nextMonthName] > 0) : [];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 relative overflow-hidden">
      <div className="bg-white border-b border-orange-100 px-6 py-4 flex items-center gap-4 shrink-0 shadow-sm z-10">
        <button onClick={() => setSelectedMember(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-800" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Review: {selectedMember.name}</h1>
          <p className="text-xs text-slate-500 font-medium">{selectedMember.teamName}</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Daily Deliverables */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Deliverables for Today</h2>
            </div>
            <div className="p-4">
              {dailyKpis.length > 0 ? (
                <div className="space-y-3">
                  {dailyKpis.map(k => (
                    <div key={k.id} className="flex justify-between items-center bg-orange-50/50 p-3 rounded-xl border border-orange-100">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{k.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{k.team}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Target vs Actual</p>
                        <p className="text-sm font-bold text-teal-700">
                          {k.dailyActual?.[todayStr] || 0} / {k.dailyAlloc?.[todayStr] || 0}
                          <span className="text-xs text-slate-500 ml-1">{k.unit}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic text-center py-4">No daily targets assigned for today.</p>
              )}
            </div>
          </div>

          {/* Weekly Deliverables */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Deliverables for This Week</h2>
            </div>
            <div className="p-4">
              {weeklyKpis.length > 0 ? (
                <div className="space-y-3">
                  {weeklyKpis.map(k => (
                    <div key={k.id} className="flex justify-between items-center bg-teal-50/30 p-3 rounded-xl border border-teal-100">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{k.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{k.team}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Target vs Actual</p>
                        <p className="text-sm font-bold text-teal-700">
                          {k.weeklyActual?.[currentWeekId] || 0} / {k.weeklyAlloc?.[currentWeekId] || 0}
                          <span className="text-xs text-slate-500 ml-1">{k.unit}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic text-center py-4">No weekly targets assigned for this week.</p>
              )}
            </div>
          </div>

          {/* Support Required */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Support Required / Notes</h2>
            </div>
            <div className="p-4">
              <textarea
                value={notes[selectedMember.id || selectedMember.name] || ""}
                onChange={(e) => handleNotesChange(selectedMember.id || selectedMember.name, e.target.value)}
                placeholder={`Type any support ${selectedMember.name} needs or general notes here...`}
                className="w-full h-32 p-3 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-400 focus:bg-white transition-colors resize-none"
              />
            </div>
          </div>

          {/* Next Month Plan (Only visible >= 28th) */}
          {nextMonthName && (
            <div className="bg-white rounded-2xl shadow-sm border border-purple-200 overflow-hidden ring-1 ring-purple-100">
              <div className="bg-purple-50 border-b border-purple-100 px-4 py-3 flex items-center justify-between">
                <h2 className="text-sm font-bold text-purple-900 uppercase tracking-wider">Plan for {nextMonthName}</h2>
                <span className="text-[10px] font-bold bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full">End of Month Review</span>
              </div>
              <div className="p-4">
                {nextMonthKpis.length > 0 ? (
                  <div className="space-y-3">
                    {nextMonthKpis.map(k => (
                      <div key={k.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{k.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{k.team}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Monthly Target</p>
                          <p className="text-sm font-bold text-purple-700">
                            {k.monthlyAlloc?.[nextMonthName] || 0}
                            <span className="text-xs text-slate-500 ml-1">{k.unit}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic text-center py-4">No targets planned for {nextMonthName} yet.</p>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}


function AdminApp({ loggedInUser, kpis, setKpis, onLog, teams, onAddMember, onAddVertical, onDeleteMember, onDeleteTeam, onAddKpi, projects, onAddProject, onUpdateProjectStage, onEditKpi, onDeleteKpi, onDeleteProject, onRestoreProject, onUploadKpis, handleCompleteAction, onUpdateMember, clientProjects, onAddClientProject, onUpdateClientProjectStage, onDeleteClientProject, clientProjectLogs, onAddClientProjectLog }) {
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
  const [activeMemberKpis, setActiveMemberKpis] = useState(null);
  const [activeTeamId, setActiveTeamId] = useState(1);
  const [activeMemberFilter, setActiveMemberFilter] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [addKpiOpen, setAddKpiOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [addProjectOpen, setAddProjectOpen] = useState(false);
  const [projectTab, setProjectTab] = useState("open");
  const [editingKpi, setEditingKpi] = useState(null);
  const [kpiView, setKpiView] = useState("grid");
  const [showTemplate, setShowTemplate] = useState(false);
  const [uploadTeam, setUploadTeam] = useState("");
  const [uploadOwner, setUploadOwner] = useState("");
  const [uploadDrive, setUploadDrive] = useState("");
  const [uploadMonitor, setUploadMonitor] = useState("");
  const [columnMapModal, setColumnMapModal] = useState(null); // { headers, rows } when open
  const [dashboardMonth, setDashboardMonth] = useState(() => {
    const d = new Date();
    const m = d.toLocaleString('en-US', { month: 'short' });
    const yr = ["Jan", "Feb", "Mar"].includes(m) ? "2027" : "2026";
    return `${m} ${yr}`;
  });

  // Daily vs Monthly view toggle for dashboard
  const [dashboardMode, setDashboardMode] = useState("daily"); // "daily" or "monthly"
  const [dashboardDate, setDashboardDate] = useState(() => new Date().toISOString().split('T')[0]);

  const handleDownloadTemplate = () => {
    const headers = [
      ["KPI no", "KPI", "Team", "DO", "DRIVE", "MONITOR", "UOM", "UP/ Down", "CY Target", ...MONTHS_LIST]
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
    
    MONTHS_LIST.forEach(m => {
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
      kpi.customHolidays || {},
      kpi.excludeSundays ?? true
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
  const [editingCell, setEditingCell] = useState(null);
  const [gridKpis, setGridKpis] = useState([]);

  // Sync gridKpis with DB kpis, padded to exactly 500 rows
  useEffect(() => {
    const list = [...kpis];
    const padCount = Math.max(0, 500 - list.length);
    for (let i = 0; i < padCount; i++) {
      list.push({
        id: `temp_${i}`,
        isTemp: true,
        name: "",
        team: "",
        owner: "",
        driveBy: "",
        monitorBy: "",
        unit: "Nos",
        direction: "higher",
        target: 0,
        monthlyAlloc: {},
        monthlyActual: {},
        targetsList: [],
        history: []
      });
    }
    setGridKpis(list);
  }, [kpis]);

  const handleLocalGridCellChange = (kpiId, field, val) => {
    setGridKpis((prev) => prev.map((k) => {
      if (k.id === kpiId) {
        let updated = { ...k };
        if (field === "name") updated.name = val;
        else if (field === "team") updated.team = val;
        else if (field === "owner") updated.owner = val;
        else if (field === "driveBy") updated.driveBy = val;
        else if (field === "monitorBy") updated.monitorBy = val;
        else if (field === "unit") updated.unit = val.startsWith(" ") ? val : " " + val;
        else if (field === "direction") updated.direction = val;
        else if (field === "target") updated.target = parseFloat(val) || 0;
        
        updated.isDirty = true;
        return updated;
      }
      return k;
    }));
  };

  const handleLocalGridTargetChange = (kpiId, monthName, val) => {
    const numVal = parseFloat(val) || 0;
    const monthKey = monthName;
    
    setGridKpis((prev) => prev.map((k) => {
      if (k.id === kpiId) {
        const nextM = { ...(k.monthlyAlloc || {}), [monthKey]: numVal };
        const rawMonth = monthName.split(' ')[0];
        const year = monthName.split(' ')[1] || (["Jan", "Feb", "Mar"].includes(rawMonth) ? "2027" : "2026");
        const totalTarget = Object.values(nextM).reduce((a, b) => a + b, 0);

        let targetsList = [...(k.targetsList || [])].filter(t => t.id !== monthKey);
        if (numVal > 0) {
          let lastDay = "30";
          if (["Jan", "Mar", "May", "Jul", "Aug", "Oct", "Dec"].includes(rawMonth)) lastDay = "31";
          else if (rawMonth === "Feb") lastDay = "28";
          const monthNum = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(rawMonth) + 1;
          const padMonth = monthNum < 10 ? "0" + monthNum : monthNum;
          const targetDate = `${year}-${padMonth}-${lastDay}`;
          targetsList.push({ id: monthKey, label: monthKey, targetValue: numVal, targetDate });
        }

        return {
          ...k,
          monthlyAlloc: nextM,
          target: totalTarget,
          targetsList,
          isDirty: true
        };
      }
      return k;
    }));
  };

  const handleLocalGridActualChange = (kpiId, monthName, val) => {
    const numVal = parseFloat(val) || 0;
    const monthKey = monthName;

    setGridKpis((prev) => prev.map((k) => {
      if (k.id === kpiId) {
        const nextM = { ...(k.monthlyActual || {}) };
        nextM[monthKey] = numVal;
        return {
          ...k,
          monthlyActual: nextM,
          isDirty: true
        };
      }
      return k;
    }));
  };

  const handleSaveGrid = async () => {
    setLoading(true);
    try {
      const inserts = [];
      const updates = [];

      for (const row of gridKpis) {
        if (!row.isDirty) continue;

        if (row.isTemp) {
          if (row.name && row.name.trim() !== "") {
            inserts.push({
              name: row.name,
              team: row.team || "Digital Marketing",
              owner: row.owner || "Anand Kumar",
              drive_by: row.driveBy || "",
              monitor_by: row.monitorBy || "",
              unit: row.unit || " Nos",
              direction: row.direction || "higher",
              target: row.target || 0,
              monthly_alloc: row.monthlyAlloc || {},
              monthly_actual: row.monthlyActual || {},
              targets_list: row.targetsList || [],
              history: row.history || [{ d: "W1", v: 0 }],
              daily_actual: {},
              revised_alloc: {},
              custom_holidays: {},
              holidays_enabled: true,
              target_type: "monthly",
              weekly_alloc: {},
              weekly_actual: {},
              daily_alloc: {}
            });
          }
        } else {
          updates.push(row);
        }
      }

      if (inserts.length > 0) {
        const { error: insertError } = await supabase.from('kpis').insert(inserts);
        if (insertError) throw insertError;
      }

      for (const row of updates) {
        const { error: updateError } = await supabase.from('kpis').update({
          name: row.name,
          team: row.team,
          owner: row.owner,
          drive_by: row.driveBy,
          monitor_by: row.monitorBy,
          unit: row.unit,
          direction: row.direction,
          target: row.target,
          monthly_alloc: row.monthlyAlloc,
          monthly_actual: row.monthlyActual,
          targets_list: row.targetsList
        }).eq('id', row.id);
        if (updateError) throw updateError;
      }

      alert("Spreadsheet saved successfully!");
      setIsEditingGrid(false);

      // Fetch latest KPIs to refresh UI
      const { data: dbKpis } = await supabase.from('kpis').select('*');
      if (dbKpis) {
        setKpis(dbKpis.map(k => ({
          id: k.id,
          name: k.name,
          unit: k.unit,
          target: parseFloat(k.target),
          direction: k.direction,
          team: k.team,
          owner: k.owner,
          driveBy: k.drive_by,
          monitorBy: k.monitor_by,
          description: k.description,
          kra: k.kra,
          history: k.history || [],
          dailyActual: k.daily_actual || {},
          revisedAlloc: k.revised_alloc || {},
          customHolidays: k.custom_holidays || {},
          holidaysEnabled: k.holidays_enabled !== false,
          targetType: k.target_type || "weekly",
          targetsList: k.targets_list || [],
          monthlyAlloc: k.monthly_alloc || {},
          monthlyActual: k.monthly_actual || {},
          weeklyAlloc: k.weekly_alloc || {},
          weeklyActual: k.weekly_actual || {},
          dailyAlloc: k.daily_alloc || {}
        })));
      }
    } catch (err) {
      alert("Error saving spreadsheet: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    const list = [...kpis];
    const padCount = Math.max(0, 500 - list.length);
    for (let i = 0; i < padCount; i++) {
      list.push({
        id: `temp_${i}`,
        isTemp: true,
        name: "",
        team: "",
        owner: "",
        driveBy: "",
        monitorBy: "",
        unit: "Nos",
        direction: "higher",
        target: 0,
        monthlyAlloc: {},
        monthlyActual: {},
        targetsList: [],
        history: []
      });
    }
    setGridKpis(list);
    setEditingCell(null);
    setIsEditingGrid(false);
  };

  const renderExcelCell = (kpi, field, value, type = "text", customDisplay = null) => {
    const isEditing = isEditingGrid && editingCell && editingCell.kpiId === kpi.id && editingCell.field === field;
    
    if (isEditing) {
      if (type === "select") {
        return (
          <select 
            value={value}
            autoFocus
            onBlur={() => setEditingCell(null)}
            onChange={(e) => {
              handleLocalGridCellChange(kpi.id, field, e.target.value);
              setEditingCell(null);
            }}
            className="w-full h-full bg-white px-1.5 py-1 text-xs focus:outline-none border border-teal-500 font-medium text-slate-800"
          >
            <option value="higher">higher</option>
            <option value="lower">lower</option>
          </select>
        );
      }
      
      return (
        <input 
          type={type}
          value={value}
          autoFocus
          onBlur={() => setEditingCell(null)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setEditingCell(null);
            }
          }}
          onChange={(e) => handleLocalGridCellChange(kpi.id, field, e.target.value)}
          className="w-full h-full bg-white px-1.5 py-1 text-xs focus:outline-none border border-teal-500 font-mono text-slate-800"
        />
      );
    }
    
    return (
      <div 
        onDoubleClick={() => {
          if (isEditingGrid) {
            setEditingCell({ kpiId: kpi.id, field });
          }
        }}
        className={`w-full h-full min-h-[32px] flex items-center px-2 select-none truncate ${isEditingGrid ? "cursor-text hover:bg-slate-50" : "cursor-default"}`}
        title={isEditingGrid ? "Double click to edit" : ""}
      >
        {customDisplay !== null ? customDisplay : value}
      </div>
    );
  };

  const filteredAdminNav = useMemo(() => {
    return ADMIN_NAV.filter(item => {
      if (item.id === "build_projects") {
        return loggedInUser?.name === "M Abhilash 20592";
      }
      return true;
    });
  }, [loggedInUser]);

  const [screen, setScreenInternal] = useState("dashboard");
  const setScreen = (newScreen) => {
    if (newScreen === "build_projects" && loggedInUser?.name !== "M Abhilash 20592") {
      setScreenInternal("dashboard");
    } else {
      setScreenInternal(newScreen);
    }
  };
  const [settingsTab, setSettingsTab] = useState("spreadsheet");
  const [isEditingHierarchy, setIsEditingHierarchy] = useState(false);
  const [detailId, setDetailId] = useState(null);
  const [loggingId, setLoggingId] = useState(null);
  const [teamFilter, setTeamFilter] = useState("All teams");
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [addVerticalOpen, setAddVerticalOpen] = useState(false);
  const [credEditId, setCredEditId] = useState(null);
  const [credEditData, setCredEditData] = useState({ loginId: "", password: "" });
  const [selectedActiveProject, setSelectedActiveProject] = useState(null);
  const [selectedClientProject, setSelectedClientProject] = useState(null);
  const [addClientProjectOpen, setAddClientProjectOpen] = useState(false);
  const [editingClientProject, setEditingClientProject] = useState(null);

  const sidebarMinimized = screen === "teams" && activeMemberFilter !== null;

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
  
  const onTrackCount = kpis.filter((k) => {
    if (dashboardMonth === "All Year") return getStatus(k) === "on-track";
    const t = k.monthlyAlloc?.[dashboardMonth] || 0;
    const a = k.monthlyActual?.[dashboardMonth] || 0;
    if (k.direction === "higher") {
      const ratio = t === 0 ? 1 : a / t;
      return ratio >= 1;
    } else {
      return a <= t;
    }
  }).length;

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
        ${sidebarMinimized ? "md:w-12" : "md:w-48"}
      `}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-orange-100">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-orange-300 to-teal-300 flex items-center justify-center shrink-0">
              <span className="text-white font-semibold text-sm" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>P</span>
            </div>
            {!sidebarMinimized && <span className="font-semibold text-slate-900 whitespace-nowrap" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>PulseKPI</span>}
          </div>
          {mobileMenuOpen && (
            <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 md:hidden">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <nav className="flex-1 px-2.5 py-4 space-y-1 overflow-y-auto">
          {filteredAdminNav.map((item) => {
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
                  isActive ? "bg-orange-100 text-orange-700 font-bold" : "text-slate-500 hover:bg-orange-50"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!sidebarMinimized && <span className="whitespace-nowrap">{item.label}</span>}
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
            <h1 className="text-base sm:text-lg font-semibold text-slate-900 capitalize" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>{screen}</h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Individual Employee Screen Preview Switcher */}
            <div className="relative">
              <select
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "admin") {
                    // Set back to admin view
                    setActiveMemberFilter(null);
                    setActiveMemberKpis(null);
                  } else {
                    const memberObj = teams.flatMap(t => t.members).find(m => m.name === val);
                    if (memberObj) {
                      setActiveMemberFilter(memberObj);
                      // Pull employee's individual KPIs
                      const employeeKpis = kpis.filter(k => k.owner === val);
                      setActiveMemberKpis(employeeKpis);
                    }
                  }
                }}
                value={activeMemberFilter ? activeMemberFilter.name : "admin"}
                className="appearance-none bg-orange-50 border border-orange-100 hover:border-orange-200 rounded-full pl-4 pr-9 py-1.5 text-xs text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-teal-300 cursor-pointer"
              >
                <option value="admin">💻 Admin (Desktop View)</option>
                {teams.map(t => 
                  t.members.map(m => (
                    <option key={m.id || m.name} value={m.name}>
                      👤 {m.name} ({t.name})
                    </option>
                  ))
                )}
              </select>
              <ChevronDown className="h-3 w-3 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="relative hidden lg:block">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input placeholder="Search..." className="pl-9 pr-4 py-2 rounded-full bg-orange-50 border border-orange-100 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-teal-300" />
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-8 py-6">
          {screen === "dashboard" && (
            <>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-orange-100">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-slate-800" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Overview</h2>
                  
                  {/* Daily vs Monthly View Toggle */}
                  <div className="bg-slate-100/80 p-0.5 rounded-xl flex items-center shadow-inner">
                    <button
                      onClick={() => setDashboardMode("daily")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        dashboardMode === "daily"
                          ? "bg-teal-600 text-white shadow-sm"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Daily
                    </button>
                    <button
                      onClick={() => setDashboardMode("monthly")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        dashboardMode === "monthly"
                          ? "bg-teal-600 text-white shadow-sm"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Monthly
                    </button>
                  </div>
                </div>

                {/* Dynamic Controls based on toggle mode */}
                <div className="flex items-center gap-2">
                  {dashboardMode === "daily" ? (
                    <div className="flex items-center gap-1.5 bg-white border border-orange-100 rounded-xl p-1.5 shadow-xs">
                      {/* Left arrow navigate date */}
                      <button
                        onClick={() => {
                          const curr = new Date(dashboardDate);
                          curr.setDate(curr.getDate() - 1);
                          setDashboardDate(curr.toISOString().split('T')[0]);
                        }}
                        className="p-1 rounded-lg hover:bg-orange-50 text-slate-600 transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      
                      {/* Interactive Custom Styled Calendar Date Picker */}
                      <div className="relative flex items-center gap-1.5 px-2.5 py-1 hover:bg-orange-50 rounded-lg cursor-pointer group">
                        <Calendar className="h-4 w-4 text-teal-600" />
                        <input
                          type="date"
                          value={dashboardDate}
                          onChange={(e) => setDashboardDate(e.target.value)}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                        />
                        <span className="text-xs font-bold text-slate-700 min-w-[85px] text-center select-none group-hover:text-teal-700 transition-colors">
                          {new Date(dashboardDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>

                      {/* Right arrow navigate date */}
                      <button
                        onClick={() => {
                          const curr = new Date(dashboardDate);
                          curr.setDate(curr.getDate() + 1);
                          setDashboardDate(curr.toISOString().split('T')[0]);
                        }}
                        className="p-1 rounded-lg hover:bg-orange-50 text-slate-600 transition-colors"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <select 
                        value={dashboardMonth} 
                        onChange={(e) => setDashboardMonth(e.target.value)} 
                        className="appearance-none bg-white border border-orange-100 rounded-full pl-4 pr-9 py-1.5 text-xs text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-teal-200 cursor-pointer shadow-xs"
                      >
                        <option value="All Year">All Year</option>
                        {MONTHS_LIST.map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                      <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  )}
                </div>
              </div>
              {(() => {
                // Determine active member context
                const activeName = activeMemberFilter ? activeMemberFilter.name : null;

                // Resolve members list this user manages
                const subMembers = [];
                if (activeName) {
                  // Find all members who report directly or indirectly to the active user
                  const traverseReports = (managerName) => {
                    teams.forEach(t => {
                      t.members.forEach(m => {
                        if (m.reportingManager === managerName && !subMembers.some(sm => sm.name === m.name)) {
                          subMembers.push(m);
                          traverseReports(m.name);
                        }
                      });
                    });
                  };
                  traverseReports(activeName);
                }

                // Filter KPIs relative to selection
                const displayKpis = activeName
                  ? kpis.filter(k => 
                      k.owner === activeName || 
                      k.driveBy === activeName || 
                      k.monitorBy === activeName ||
                      subMembers.some(sm => k.owner === sm.name || k.driveBy === sm.name || k.monitorBy === sm.name)
                    )
                  : kpis;

                const activeCount = displayKpis.length;

                // Calculate daily / monthly on track count dynamically
                const trackCount = displayKpis.filter(k => {
                  let tVal = k.target;
                  let aVal = getLatest(k);
                  if (dashboardMode === "daily") {
                    const info = getDailyTargetInfo(k, dashboardDate);
                    tVal = info.target;
                    aVal = k.dailyActual?.[dashboardDate] || 0;
                  } else {
                    if (dashboardMonth !== "All Year") {
                      tVal = k.monthlyAlloc?.[dashboardMonth] ?? Math.round(((k.target || 0) / 12) * 100) / 100;
                      aVal = k.monthlyActual?.[dashboardMonth] || 0;
                    }
                  }
                  
                  if (k.direction === "higher") {
                    const ratio = tVal === 0 ? 1 : aVal / tVal;
                    return ratio >= 1;
                  } else {
                    return aVal <= tVal;
                  }
                }).length;

                // Employees count
                let employeeCount = 0;
                if (activeName) {
                  // Count the user themselves + anyone reporting to them
                  employeeCount = 1 + subMembers.length;
                } else {
                  employeeCount = teams.reduce((acc, t) => acc + t.members.length, 0);
                }

                return (
                  <>
                    <div className="flex flex-col sm:flex-row gap-3 mb-6">
                      <StatCard icon={Star} iconBg="bg-orange-100" iconColor="text-orange-500" value={activeCount} label="Active KPIs" />
                      <StatCard icon={Mountain} iconBg="bg-teal-100" iconColor="text-teal-500" value={trackCount} label="On track" />
                      <StatCard icon={UserCheck} iconBg="bg-rose-100" iconColor="text-rose-500" value={employeeCount} label="Employees tracked" />
                    </div>
                    <div className="space-y-8">
                      {(() => {
                        if (!activeName) {
                          // Standard Grid when no member is selected
                          return (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {displayKpis.map((kpi) => {
                                const isDo = false;
                                const isDrive = false;
                                const isMonitor = false;
                                
                                let dispTarget = kpi.target;
                                let dispActual = getLatest(kpi);
                                let dispStatus = getStatus(kpi);
                                let dispLabel = "Target";
                                let upcomingText = "";
                                let pendingSumVal = 0;

                                if (dashboardMode === "daily") {
                                  const targetDateStr = dashboardDate;
                                  const info = getDailyTargetInfo(kpi, targetDateStr);
                                  dispTarget = info.target;
                                  dispActual = kpi.dailyActual?.[targetDateStr] || 0;
                                  pendingSumVal = info.pendingSum;
                                  
                                  if (kpi.direction === "higher") {
                                    const ratio = dispTarget === 0 ? 1 : dispActual / dispTarget;
                                    dispStatus = ratio >= 1 ? "on-track" : (ratio >= 0.92 ? "at-risk" : "off-track");
                                  } else {
                                    dispStatus = dispActual <= dispTarget ? "on-track" : (dispActual <= dispTarget * 1.2 ? "at-risk" : "off-track");
                                  }
                                  
                                  if (info.upcomingInfo) {
                                    dispLabel = "Upcoming Target";
                                    upcomingText = ` ${info.upcomingInfo}`;
                                  } else {
                                    dispLabel = "Daily Target";
                                  }
                                } else {
                                  if (dashboardMonth !== "All Year") {
                                    const mKey = dashboardMonth;
                                    dispTarget = kpi.monthlyAlloc?.[mKey] ?? Math.round(((kpi.target || 0) / 12) * 100) / 100;
                                    dispActual = kpi.monthlyActual?.[mKey] || 0;
                                    if (kpi.direction === "higher") {
                                      const ratio = dispTarget === 0 ? 1 : dispActual / dispTarget;
                                      dispStatus = ratio >= 1 ? "on-track" : (ratio >= 0.92 ? "at-risk" : "off-track");
                                    } else {
                                      dispStatus = dispActual <= dispTarget ? "on-track" : (dispActual <= dispTarget * 1.2 ? "at-risk" : "off-track");
                                    }
                                    dispLabel = `${dashboardMonth.split(' ')[0]} Target`;
                                  }
                                }

                                return (
                                  <button key={kpi.id} onClick={() => setDetailId(kpi.id)} className="text-left bg-white border border-orange-100 rounded-xl p-3 hover:border-orange-200 hover:shadow-sm transition-all relative overflow-hidden">
                                    <div className="flex items-start justify-between mb-0.5">
                                      <div className="flex-1 min-w-0 pr-2">
                                        <p className="text-sm font-medium text-slate-600 truncate">{kpi.name}</p>
                                      </div>
                                      <StatusBadge status={dispStatus} />
                                    </div>
                                    <p className="text-xl font-bold text-slate-900 truncate flex items-baseline" title={`${dispActual} / ${dispTarget}${kpi.unit}`}>
                                      <AnimatedCounter value={dispActual} />
                                      <span className="text-slate-400 font-medium mx-1 text-sm">/</span>
                                      <span className="text-lg"><AnimatedCounter value={dispTarget} /></span>
                                      {upcomingText && <span className="text-[10px] text-slate-400 font-semibold ml-1">{upcomingText}</span>}
                                      {pendingSumVal > 0 && (
                                        <span className="text-[10px] text-rose-600 font-bold ml-2 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100 animate-pulse">
                                          ({pendingSumVal} pending)
                                        </span>
                                      )}
                                      <span className="text-sm text-slate-400 ml-1">{kpi.unit}</span>
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">{dispLabel} · {kpi.team}</p>
                                  </button>
                                );
                              })}
                            </div>
                          );
                        }

                        // Categorize KPIs for the active member
                        const doKpis = displayKpis.filter(k => k.owner === activeName);
                        const driveKpis = displayKpis.filter(k => k.driveBy === activeName);
                        const monitorKpis = displayKpis.filter(k => k.monitorBy === activeName);

                        const renderGroup = (title, kpiList, badgeColor, roleLabel) => {
                          if (kpiList.length === 0) return null;
                          return (
                            <div className="space-y-3">
                              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pl-1">
                                {title} ({kpiList.length})
                              </h3>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {kpiList.map(kpi => {
                                  let dispTarget = kpi.target;
                                  let dispActual = getLatest(kpi);
                                  let dispStatus = getStatus(kpi);
                                  let dispLabel = "Target";
                                  let upcomingText = "";
                                  let pendingSumVal = 0;

                                  if (dashboardMode === "daily") {
                                    const targetDateStr = dashboardDate;
                                    const info = getDailyTargetInfo(kpi, targetDateStr);
                                    dispTarget = info.target;
                                    dispActual = kpi.dailyActual?.[targetDateStr] || 0;
                                    pendingSumVal = info.pendingSum;
                                    
                                    if (kpi.direction === "higher") {
                                      const ratio = dispTarget === 0 ? 1 : dispActual / dispTarget;
                                      dispStatus = ratio >= 1 ? "on-track" : (ratio >= 0.92 ? "at-risk" : "off-track");
                                    } else {
                                      dispStatus = dispActual <= dispTarget ? "on-track" : (dispActual <= dispTarget * 1.2 ? "at-risk" : "off-track");
                                    }
                                    
                                    if (info.upcomingInfo) {
                                      dispLabel = "Upcoming Target";
                                      upcomingText = ` ${info.upcomingInfo}`;
                                    } else {
                                      dispLabel = "Daily Target";
                                    }
                                  } else {
                                    if (dashboardMonth !== "All Year") {
                                      const mKey = dashboardMonth;
                                      dispTarget = kpi.monthlyAlloc?.[mKey] ?? Math.round(((kpi.target || 0) / 12) * 100) / 100;
                                      dispActual = kpi.monthlyActual?.[mKey] || 0;
                                      if (kpi.direction === "higher") {
                                        const ratio = dispTarget === 0 ? 1 : dispActual / dispTarget;
                                        dispStatus = ratio >= 1 ? "on-track" : (ratio >= 0.92 ? "at-risk" : "off-track");
                                      } else {
                                        dispStatus = dispActual <= dispTarget ? "on-track" : (dispActual <= dispTarget * 1.2 ? "at-risk" : "off-track");
                                      }
                                      dispLabel = `${dashboardMonth.split(' ')[0]} Target`;
                                    }
                                  }

                                  return (
                                    <button key={kpi.id} onClick={() => setDetailId(kpi.id)} className="text-left bg-white border border-orange-100 rounded-xl p-3 hover:border-orange-200 hover:shadow-sm transition-all relative overflow-hidden">
                                      <div className="flex items-start justify-between mb-0.5">
                                        <div className="flex-1 min-w-0 pr-2">
                                          <p className="text-sm font-medium text-slate-600 truncate">{kpi.name}</p>
                                          <span className={`inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${badgeColor}`}>
                                            {roleLabel}
                                          </span>
                                        </div>
                                        <StatusBadge status={dispStatus} />
                                      </div>
                                      <p className="text-xl font-bold text-slate-900 truncate flex items-baseline" title={`${dispActual} / ${dispTarget}${kpi.unit}`}>
                                        <AnimatedCounter value={dispActual} />
                                        <span className="text-slate-400 font-medium mx-1 text-sm">/</span>
                                        <span className="text-lg"><AnimatedCounter value={dispTarget} /></span>
                                        {upcomingText && <span className="text-[10px] text-slate-400 font-semibold ml-1">{upcomingText}</span>}
                                        {pendingSumVal > 0 && (
                                          <span className="text-[10px] text-rose-600 font-bold ml-2 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100 animate-pulse">
                                            ({pendingSumVal} pending)
                                          </span>
                                        )}
                                        <span className="text-sm text-slate-400 ml-1">{kpi.unit}</span>
                                      </p>
                                      <p className="text-xs text-slate-400 mt-1">{dispLabel} · {kpi.team}</p>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        };

                        return (
                          <>
                            {renderGroup("DO (Owner)", doKpis, "bg-teal-50 text-teal-700 border-teal-150", "DO")}
                            {renderGroup(`DRIVE (${activeName})`, driveKpis, "bg-indigo-50 text-indigo-700 border-indigo-150", "DRIVE")}
                            {renderGroup(`MONITOR (${activeName})`, monitorKpis, "bg-amber-50 text-amber-700 border-amber-150", "MONITOR")}
                          </>
                        );
                      })()}
                    </div>
                  </>
                );
              })()}
            </>
          )}

          {screen === "action" && ( 
            <ActionScreen 
              kpis={kpis} 
              projects={projects} 
              user={activeMemberFilter ? activeMemberFilter.name : "Krithika"} 
              onCompleteAction={handleCompleteAction} 
              teams={teams} 
              clientProjects={clientProjects}
              onUpdateClientProjectStage={onUpdateClientProjectStage}
            /> 
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
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <select 
                      value={dashboardMonth} 
                      onChange={(e) => setDashboardMonth(e.target.value)} 
                      className="appearance-none bg-white border border-orange-100 rounded-full pl-4 pr-9 py-2 text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-200"
                    >
                      <option value="All Year">All Year</option>
                      {MONTHS_LIST.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <button onClick={() => setAddKpiOpen(true)} className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors">
                    <Plus className="h-4 w-4" /> Add KPI
                  </button>
                </div>
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
                            {teamKpis.map((kpi) => {
                              let dispTarget = kpi.target;
                              let dispActual = getLatest(kpi);
                              let dispStatus = getStatus(kpi);
                              
                              if (dashboardMonth !== "All Year") {
                                const mKey = dashboardMonth;
                                dispTarget = kpi.monthlyAlloc?.[mKey] ?? Math.round(((kpi.target || 0) / 12) * 100) / 100;
                                dispActual = kpi.monthlyActual?.[mKey] || 0;
                                
                                if (kpi.direction === "higher") {
                                  const ratio = dispTarget === 0 ? 1 : dispActual / dispTarget;
                                  if (ratio >= 1) dispStatus = "on-track";
                                  else if (ratio >= 0.8) dispStatus = "at-risk";
                                  else dispStatus = "off-track";
                                } else {
                                  if (dispActual <= dispTarget) dispStatus = "on-track";
                                  else if (dispActual <= dispTarget * 1.2) dispStatus = "at-risk";
                                  else dispStatus = "off-track";
                                }
                              }

                              return (
                              <tr key={kpi.id} className="hover:bg-orange-50/20 cursor-pointer transition-colors" onClick={() => setDetailId(kpi.id)}>
                                <td className="px-5 py-3.5 font-bold text-slate-800 text-xs max-w-xs truncate">
                                  {kpi.name}
                                  <span className={`ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${kpi.kpiType === 'report' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                    {kpi.kpiType === 'report' ? 'Report' : 'Activity'}
                                  </span>
                                
                                    {(() => {
                                      const childKpi = kpis.find(k => String(k.id) === String(kpi.reportConfig?.followUpKpiId));
                                      const parentKpi = kpis.find(k => String(k.reportConfig?.followUpKpiId) === String(kpi.id));
                                      return (
                                        <>
                                          {parentKpi && (
                                            <div className="mt-1.5 flex items-center gap-1">
                                              <span className="font-bold text-amber-700 bg-amber-50 px-1 rounded flex items-center gap-0.5 text-[9px] border border-amber-100">
                                                <GitBranch className="w-2.5 h-2.5"/> Parent KPI
                                              </span>
                                              <span className="truncate text-amber-900 font-semibold text-[10px] max-w-[200px]">
                                                {parentKpi.name}
                                              </span>
                                            </div>
                                          )}
                                          {childKpi && (
                                            <div className="mt-1.5 flex items-center gap-1">
                                              <span className="font-bold text-indigo-700 bg-indigo-50 px-1 rounded flex items-center gap-0.5 text-[9px] border border-indigo-100">
                                                <GitBranch className="w-2.5 h-2.5"/> Child KPI
                                              </span>
                                              <span className="truncate text-indigo-900 font-semibold text-[10px] max-w-[200px]">
                                                {childKpi.name}
                                              </span>
                                            </div>
                                          )}
                                        </>
                                      );
                                    })()}
                                  </td>
                                <td className="px-5 py-3.5 text-slate-500 text-[11px] leading-relaxed max-w-xs truncate" title={kpi.description || `Key Performance Indicator: ${kpi.name}`}>
                                  {kpi.description || <span className="italic text-slate-350 font-normal">No description</span>}
                                </td>
                                <td className="px-5 py-3.5 text-slate-700">
                                  <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] text-slate-600 font-mono font-bold uppercase tracking-wider">{kpi.unit.trim()}</span>
                                </td>
                                <td className="px-5 py-3.5">
                                  <span className="capitalize font-bold text-slate-800 block text-[11px]">{dashboardMonth === 'All Year' ? kpi.targetType || "monthly" : dashboardMonth.split(' ')[0]}</span>
                                  <span className="text-[10px] text-slate-400 block mt-0.5">{dispTarget}{kpi.unit}</span>
                                </td>
                                <td className="px-5 py-3.5 text-slate-600 text-[11px] space-y-1">
                                  <div><span className="text-[9px] font-bold uppercase text-teal-700 bg-teal-50 px-1 rounded mr-1">Do</span><span className="font-bold text-slate-750">{kpi.owner}</span></div>
                                  {kpi.driveBy && <div><span className="text-[9px] font-bold uppercase text-orange-700 bg-orange-50 px-1 rounded mr-1">Drive</span><span className="font-medium text-slate-600">{kpi.driveBy}</span></div>}
                                  {kpi.monitorBy && <div><span className="text-[9px] font-bold uppercase text-purple-700 bg-purple-50 px-1 rounded mr-1">Monitor</span><span className="font-medium text-slate-600">{kpi.monitorBy}</span></div>}
                                </td>
                                <td className="px-5 py-3.5"><StatusBadge status={dispStatus} /></td>
                                <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                                  <div className="flex justify-end gap-1.5">
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); const { id, history, monthlyActual, monthly_actual, weeklyActual, weekly_actual, ...kpiCopy } = kpi; setEditingKpi({ ...kpiCopy, name: kpi.name + ' (Copy)' }); }}
                                      className="text-indigo-600 hover:text-indigo-800 p-1.5 rounded-lg border border-indigo-100 hover:bg-indigo-50 transition-all"
                                      title="Duplicate KPI"
                                    >
                                      <Copy className="h-3.5 w-3.5" />
                                    </button>
                                      <button 
                                      onClick={() => setEditingKpi(kpi)} 
                                      className="text-teal-600 hover:text-teal-800 p-1.5 rounded-lg border border-teal-100 hover:bg-teal-50 transition-all"
                                      title="Edit KPI"
                                    >
                                      <Pencil className="h-3.5 w-3.5" />
                                    </button>
                                    <button 
                                      onClick={() => {
                                        const duplicated = {
                                          ...kpi,
                                          id: `temp-${Date.now()}`,
                                          name: `${kpi.name} (Copy)`
                                        };
                                        setEditingKpi(duplicated);
                                      }}
                                      className="text-blue-500 hover:text-blue-700 p-1.5 rounded-lg border border-blue-100 hover:bg-blue-50 transition-all"
                                      title="Duplicate KPI"
                                    >
                                      <Copy className="h-3.5 w-3.5" />
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
                            );
                            })}
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
                        {teamKpis.map((kpi) => {
                          let dispTarget = kpi.target;
                          let dispActual = getLatest(kpi);
                          let dispStatus = getStatus(kpi);
                          
                          if (dashboardMonth !== "All Year") {
                            const mKey = dashboardMonth;
                            dispTarget = kpi.monthlyAlloc?.[mKey] ?? Math.round(((kpi.target || 0) / 12) * 100) / 100;
                            dispActual = kpi.monthlyActual?.[mKey] || 0;
                            
                            if (kpi.direction === "higher") {
                              const ratio = dispTarget === 0 ? 1 : dispActual / dispTarget;
                              if (ratio >= 1) dispStatus = "on-track";
                              else if (ratio >= 0.8) dispStatus = "at-risk";
                              else dispStatus = "off-track";
                            } else {
                              if (dispActual <= dispTarget) dispStatus = "on-track";
                              else if (dispActual <= dispTarget * 1.2) dispStatus = "at-risk";
                              else dispStatus = "off-track";
                            }
                          }

                          return (
                          <div key={kpi.id} onClick={() => setDetailId(kpi.id)} className="text-left bg-white border border-orange-100 rounded-xl p-2.5 hover:border-orange-200 hover:shadow-sm transition-all cursor-pointer relative group flex flex-col h-full">
  <div className="flex items-start justify-between mb-0.5">
    <p className="text-[13px] font-semibold text-slate-700 pr-3 leading-snug">{kpi.name}</p>
    <div className="flex flex-col items-end gap-0.5 shrink-0">
      <div className="flex items-center gap-1.5">
        <StatusBadge status={dispStatus} />
        <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wider ${kpi.kpiType === "report" ? "bg-purple-50 text-purple-700" : "bg-blue-50 text-blue-700"}`}>
          {kpi.kpiType === "report" ? "Report" : "Activity"}
        </span>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity mt-0 bg-white/80 p-0.5 rounded-md backdrop-blur-sm">
        <button onClick={(e) => { e.stopPropagation(); const { id, history, monthlyActual, monthly_actual, weeklyActual, weekly_actual, ...kpiCopy } = kpi; setEditingKpi({ ...kpiCopy, name: kpi.name + " (Copy)" }); }} className="text-indigo-600 hover:text-indigo-800 p-1 rounded hover:bg-indigo-50 transition-colors" title="Duplicate KPI">
          <Copy className="w-3.5 h-3.5"/>
        </button>
        <button onClick={(e) => { e.stopPropagation(); setEditingKpi(kpi); }} className="text-teal-600 hover:text-teal-800 p-1 rounded hover:bg-teal-50 transition-colors" title="Edit KPI">
          <Pencil className="w-3.5 h-3.5"/>
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDeleteKpi && onDeleteKpi(kpi.id); }} className="text-rose-600 hover:text-rose-800 p-1 rounded hover:bg-rose-50 transition-colors" title="Delete KPI">
          <Trash2 className="w-3.5 h-3.5"/>
        </button>
      </div>
    </div>
  </div>
  <p className="text-2xl font-semibold text-slate-900 truncate mb-0.5" title={`${dispActual} / ${dispTarget}${kpi.unit}`}>
    {dispActual}
    <span className="text-slate-400 font-medium mx-1">/</span>
    {dispTarget}
    <span className="text-sm text-slate-400 ml-1">{kpi.unit}</span>
  </p>
  <div className="mt-auto">
    {(() => {
      const childKpi = kpis.find(k => String(k.id) === String(kpi.reportConfig?.followUpKpiId));
      const parentKpi = kpis.find(k => String(k.reportConfig?.followUpKpiId) === String(kpi.id));
      return (
        <>
          {parentKpi && (
            <div className="whitespace-nowrap flex items-center gap-1 w-full mb-1.5">
              <span className="font-bold text-amber-700 bg-amber-50 px-1 rounded flex items-center gap-0.5 text-[9px] border border-amber-100">
                <GitBranch className="w-2.5 h-2.5"/> Parent KPI
              </span>
              <span className="truncate text-amber-900 font-semibold max-w-[150px] text-[10px]">{parentKpi.name}</span>
            </div>
          )}
          {childKpi && (
            <div className="whitespace-nowrap flex items-center gap-1 w-full mb-1.5">
              <span className="font-bold text-indigo-700 bg-indigo-50 px-1 rounded flex items-center gap-0.5 text-[9px] border border-indigo-100">
                <GitBranch className="w-2.5 h-2.5"/> Child KPI
              </span>
              <span className="truncate text-indigo-900 font-semibold max-w-[150px] text-[10px]">{childKpi.name}</span>
            </div>
          )}
        </>
      );
    })()}
    <div className="flex items-center pt-2 border-t border-orange-50 overflow-hidden mt-1">
      <div className="flex flex-nowrap items-center gap-x-2.5 text-[9.5px] w-full">
        <div className="whitespace-nowrap shrink-0"><span className="font-bold text-teal-700 bg-teal-50 px-1 rounded mr-1">Do:</span>{kpi.owner}</div>
        {kpi.driveBy && <div className="whitespace-nowrap shrink-0"><span className="font-bold text-orange-700 bg-orange-50 px-1 rounded mr-1">Drive:</span>{kpi.driveBy}</div>}
        {kpi.monitorBy && <div className="whitespace-nowrap truncate min-w-0"><span className="font-bold text-purple-700 bg-purple-50 px-1 rounded mr-1">Monitor:</span>{kpi.monitorBy}</div>}
      </div>
    </div>
  </div>
</div>
                        );
                        })}
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
                              {MONTHS_LIST.map(m => (
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
                                  {MONTHS_LIST.map(m => {
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
                                        title="Edit KPI"
                                      >
                                        <CalendarRange className="h-3.5 w-3.5" />
                                      </button>
                                      <button 
                                        onClick={() => {
                                          const duplicated = {
                                            ...kpi,
                                            id: `temp-${Date.now()}`,
                                            name: `${kpi.name} (Copy)`
                                          };
                                          setEditingKpi(duplicated);
                                        }}
                                        className="text-blue-500 hover:text-blue-700 p-1 rounded-lg border border-blue-100 hover:bg-blue-50 transition-all"
                                        title="Duplicate KPI"
                                      >
                                        <Copy className="h-3.5 w-3.5" />
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
                      <h3 className="text-lg font-bold" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>BULL Machines</h3>
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

          {screen === "review" && (
            <MorningReviewScreen teams={teams} kpis={kpis} />
          )}

          {screen === "okrs" && (
            <div className="space-y-4">
              {okrsData.map((okr) => (
                <div key={okr.id} className="bg-white border border-orange-100 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">{okr.level}</span>
                    <span className="text-xs text-slate-400">{okr.owner}</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-4" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>{okr.objective}</h3>
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



          {screen === "campaigns" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {campaignsData.map((c) => (
                <div key={c.id} className="bg-white border border-orange-100 rounded-2xl p-5">
                  <h3 className="font-semibold text-slate-900 mb-1" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>{c.name}</h3>
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

           {screen === "build_projects" && (() => {
            if (loggedInUser?.name !== "M Abhilash 20592") return null;
            return (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Build Projects Workspace</h2>
                    <p className="text-xs text-slate-400">Manage build projects, outline nested milestones, log daily progress feed, and run collaborative AI debates.</p>
                  </div>
                  <button onClick={() => setAddClientProjectOpen(true)} className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors shadow-sm">
                    <Plus className="h-4 w-4" /> New Build Project
                  </button>
                </div>

                {/* Masonry or Uneven Column Align Layout */}
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 [column-fill:_balance] break-inside-avoid">
                  {clientProjects.map((proj) => {
                    const totalStages = proj.stages?.length || 0;
                    const completedStages = proj.stages?.filter(s => s.status === "completed").length || 0;
                    const percentComplete = totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;
                    return (
                      <div key={proj.id} className="bg-white border border-orange-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 break-inside-avoid mb-6 inline-block w-full">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between w-full gap-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <h3 
                                onClick={() => setSelectedClientProject(proj)} 
                                className="text-base font-bold text-slate-900 hover:text-teal-650 hover:underline cursor-pointer truncate"
                              >
                                {proj.title}
                              </h3>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100 shrink-0">
                                {percentComplete}% Done
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => setEditingClientProject(proj)}
                                className="text-slate-400 hover:text-teal-600 p-1.5 rounded-lg border border-slate-100 hover:bg-teal-50 transition-all"
                                title="Edit Project Details"
                              >
                                <Pencil className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => onDeleteClientProject(proj.id)}
                                className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg border border-rose-100 hover:bg-rose-50 transition-all"
                                title="Delete Project"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>

                          <p className="text-xs text-slate-500 leading-relaxed">{proj.description}</p>

                          {proj.objective && (
                            <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                              <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider mb-0.5">Objective Outcomes</span>
                              <p className="text-[10px] text-slate-600 font-medium leading-normal">{proj.objective}</p>
                            </div>
                          )}
                        </div>

                        {/* Stages Progression List Preview */}
                        <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Milestone Stages</span>
                          <div className="space-y-2">
                            {proj.stages.map((stg, sIdx) => {
                              const isActive = sIdx === proj.currentStageIdx;
                              const isComp = stg.status === "completed";
                              return (
                                <div key={stg.id || sIdx} className="bg-slate-50/50 p-2 rounded-xl border border-slate-100 space-y-1">
                                  <div className="flex flex-col gap-1 text-[11px]">
                                    <div className="flex items-center justify-between gap-1">
                                      {/* Stage Name */}
                                      <span className={`font-bold truncate ${
                                        isActive 
                                          ? "text-orange-600 font-extrabold" 
                                          : isComp 
                                            ? "text-teal-650" 
                                            : "text-slate-650"
                                      }`}>
                                        {isComp ? "✓" : isActive ? "●" : "○"} {stg.name}
                                      </span>
                                      
                                      <span className={`font-bold px-1 py-0.2 rounded uppercase tracking-wider text-[8px] shrink-0 ${
                                        isComp 
                                          ? "bg-teal-50 text-teal-700" 
                                          : isActive 
                                            ? "bg-orange-50 text-orange-700" 
                                            : "bg-slate-100 text-slate-500"
                                      }`}>
                                        {stg.status}
                                      </span>
                                    </div>

                                    {/* Inline Details: Responsible & Target Date */}
                                    {(stg.responsible || stg.targetDate) && (
                                      <div className="flex flex-wrap items-center justify-between text-[9px] text-slate-400 font-medium pt-0.5 border-t border-slate-100/50">
                                        {stg.responsible && <span>R: <strong className="text-slate-600 font-semibold">{stg.responsible}</strong></span>}
                                        {stg.targetDate && <span className="font-mono">{stg.targetDate}</span>}
                                      </div>
                                    )}
                                  </div>

                                  {/* Sub-stages list inside card preview */}
                                  {stg.subStages && stg.subStages.length > 0 && (
                                    <div className="pl-2 border-l border-slate-200 space-y-0.5 mt-1 text-[9px] text-slate-500">
                                      {stg.subStages.map((sub, subIdx) => (
                                        <div key={sub.id || subIdx} className="flex justify-between items-center">
                                          <span className="truncate max-w-[130px]">↳ {sub.name}</span>
                                          {sub.responsible && <span className="text-[7.5px] bg-slate-100 text-slate-600 px-1 rounded truncate max-w-[50px]">{sub.responsible}</span>}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                  {clientProjects.length === 0 && (
                    <div className="col-span-full bg-white border border-slate-150 rounded-2xl p-12 text-center text-slate-400 italic">
                      No Build Projects found. Click "New Build Project" to get started.
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {screen === "projects" && (() => {
            const openProjects = projects.filter(p => p.status !== "bin" && p.stages[p.currentStageIdx]?.status !== "completed");
            const completedProjects = projects.filter(p => p.status !== "bin" && p.stages.length > 0 && p.stages[p.currentStageIdx]?.status === "completed" && p.currentStageIdx === p.stages.length - 1);
            const binProjects = projects.filter(p => p.status === "bin");

            const activeList = projectTab === "open" ? openProjects : (projectTab === "completed" ? completedProjects : binProjects);

            return (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">Track initiatives, milestones, and linked KPI improvements.</p>
                <button onClick={() => setAddProjectOpen(true)} className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors shadow-sm">
                  <Plus className="h-4 w-4" /> New Project
                </button>
              </div>

              {/* Project Tabs */}
              <div className="flex gap-6 border-b border-slate-200">
                <button 
                  onClick={() => setProjectTab("open")}
                  className={`pb-3 text-sm font-bold transition-colors relative ${projectTab === "open" ? "text-teal-600" : "text-slate-400 hover:text-slate-600"}`}
                >
                  Open ({openProjects.length})
                  {projectTab === "open" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-500 rounded-t-full" />}
                </button>
                <button 
                  onClick={() => setProjectTab("completed")}
                  className={`pb-3 text-sm font-bold transition-colors relative ${projectTab === "completed" ? "text-teal-600" : "text-slate-400 hover:text-slate-600"}`}
                >
                  Completed ({completedProjects.length})
                  {projectTab === "completed" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-500 rounded-t-full" />}
                </button>
                <button 
                  onClick={() => setProjectTab("bin")}
                  className={`pb-3 text-sm font-bold transition-colors relative flex items-center gap-1.5 ${projectTab === "bin" ? "text-rose-600" : "text-slate-400 hover:text-slate-600"}`}
                >
                  <Trash2 className="h-4 w-4" /> Bin ({binProjects.length})
                  {projectTab === "bin" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-rose-500 rounded-t-full" />}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-5">
                {activeList.map((proj) => {
                  return (
                    <div key={proj.id} className="bg-white border border-orange-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex-1 space-y-3">
                        <div>
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-base font-bold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>{proj.title}</h3>
                              {projectTab === "bin" && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
                                  Waiting for admin approval to remove
                                </span>
                              )}
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100">
                                Active: {proj.stages[proj.currentStageIdx]?.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 ml-auto">
                              {projectTab === "bin" ? (
                                <>
                                  <button
                                    onClick={() => onRestoreProject(proj.id)}
                                    className="text-teal-600 hover:text-teal-800 p-1.5 rounded-lg border border-teal-100 hover:bg-teal-50 transition-all font-bold text-xs"
                                    title="Restore Project"
                                  >
                                    Restore
                                  </button>
                                  <button
                                    onClick={() => onDeleteProject(proj.id, true)}
                                    className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg border border-rose-100 hover:bg-rose-50 transition-all font-bold text-xs"
                                    title="Permanently Delete"
                                  >
                                    Force Delete
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => setEditingProject(proj)}
                                    className="text-slate-400 hover:text-teal-600 p-1.5 rounded-lg border border-slate-100 hover:bg-teal-50 transition-all"
                                    title="Edit Project Details"
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={() => onDeleteProject(proj.id)}
                                    className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg border border-rose-100 hover:bg-rose-50 transition-all"
                                    title="Move to Bin"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </>
                              )}
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
            );
          })()}

          {screen === "settings" && (() => {
            const allPlayers = teams.flatMap(t => t.members.map(m => ({
              ...m,
              teamId: t.id,
              teamName: t.name
            })));
            const managerOptions = [...new Set(allPlayers.map(p => p.name))];

            return (
              <div className="space-y-6 w-full max-w-full px-2">
                {/* Settings Sub-Tabs Navigation */}
                <div className="flex border-b border-orange-100 pb-px shrink-0 gap-3">
                  <button
                    onClick={() => setSettingsTab("spreadsheet")}
                    className={`px-5 py-2.5 font-bold text-xs sm:text-sm transition-all border-b-2 -mb-px flex items-center gap-1.5 ${
                      settingsTab === "spreadsheet"
                        ? "border-teal-500 text-teal-600 font-extrabold"
                        : "border-transparent text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    📊 KPI Grid Spreadsheet
                  </button>
                  <button
                    onClick={() => setSettingsTab("teams")}
                    className={`px-5 py-2.5 font-bold text-xs sm:text-sm transition-all border-b-2 -mb-px flex items-center gap-1.5 ${
                      settingsTab === "teams"
                        ? "border-teal-500 text-teal-600 font-extrabold"
                        : "border-transparent text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    👥 Teams & Players
                  </button>
                  <button
                    onClick={() => setSettingsTab("utilities")}
                    className={`px-5 py-2.5 font-bold text-xs sm:text-sm transition-all border-b-2 -mb-px flex items-center gap-1.5 ${
                      settingsTab === "utilities"
                        ? "border-teal-500 text-teal-600 font-extrabold"
                        : "border-transparent text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    ⚙️ Org & Utilities
                  </button>
                  <button
                    onClick={() => setSettingsTab("credentials")}
                    className={`px-5 py-2.5 font-bold text-xs sm:text-sm transition-all border-b-2 -mb-px flex items-center gap-1.5 ${
                      settingsTab === "credentials"
                        ? "border-teal-500 text-teal-600 font-extrabold"
                        : "border-transparent text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    🔐 User Credentials
                  </button>
                </div>

                {settingsTab === "utilities" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Organization info card */}
                <div className="bg-white border border-orange-100 rounded-2xl p-5 shadow-sm">
                  <h3 className="font-semibold text-slate-900 mb-3" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Organization</h3>
                  <div className="space-y-3 text-sm">
                    <div><p className="text-slate-400 text-xs mb-1">Name</p><p className="text-slate-800 font-medium">BULL Machines</p></div>
                    <div><p className="text-slate-400 text-xs mb-1">Industry</p><p className="text-slate-800 font-medium">Manufacturing</p></div>
                    <div><p className="text-slate-400 text-xs mb-1">Plan</p><p className="text-slate-800 font-medium">Team</p></div>
                  </div>
                </div>

                {/* Database utilities upload/download card */}
                <div className="bg-white border border-orange-100 rounded-2xl p-5 shadow-sm space-y-4">
                  <h3 className="font-semibold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Database Utilities</h3>
                  
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

                                // Find header row (first non-empty row)
                                let headerIdx = -1;
                                for (let i = 0; i < rows.length; i++) {
                                  const row = rows[i];
                                  if (row && row.some(c => c !== undefined && c !== null && String(c).trim() !== "")) {
                                    headerIdx = i;
                                    break;
                                  }
                                }

                                if (headerIdx === -1) {
                                  alert("Could not detect any header row in the Excel file.");
                                  return;
                                }

                                const detectedHeaders = rows[headerIdx].map(h => String(h || "").trim()).filter(h => h !== "");
                                // Open column mapping popup
                                setColumnMapModal({ headers: detectedHeaders, allHeaders: rows[headerIdx].map(h => String(h || "").trim()), rows, headerIdx });
                              } catch (err) {
                                alert("Failed to read Excel file: " + err.message);
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
                )}

                {settingsTab === "teams" && (
                  <div className="space-y-6">
                    {/* Teams list card */}
                    <div className="bg-white border border-orange-100 rounded-2xl p-5 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-900 text-base" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Teams List</h3>
                          <p className="text-xs text-slate-400 mt-0.5 font-medium text-slate-500">View and manage organizational team groups.</p>
                        </div>
                        <button 
                          onClick={() => setAddVerticalOpen(true)} 
                          className="text-xs text-teal-600 hover:text-teal-700 font-bold bg-teal-50 border border-teal-100 px-3.5 py-2 rounded-xl transition-all shadow-sm"
                        >
                          + Add Team
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {teams.map(t => (
                          <div key={t.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/20 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start border-b border-slate-150 pb-2 mb-2">
                                <span className="font-bold text-slate-800 text-sm">📂 {t.name}</span>
                                <button
                                  onClick={() => onDeleteTeam(t.id)}
                                  className="text-[10px] text-rose-500 hover:text-rose-600 font-bold hover:underline"
                                >
                                  Delete
                                </button>
                              </div>
                              <p className="text-[11px] text-slate-500">{t.description || "No description provided."}</p>
                              <div className="text-[11px] text-slate-600 mt-2 font-medium flex items-center gap-1.5">
                                <span className="text-slate-400 font-normal">Team Lead:</span>
                                {isEditingHierarchy ? (
                                  <select 
                                    value={t.leadEmployeeId || ""}
                                    onChange={(e) => handleSetTeamLead(t.id, e.target.value)}
                                    className="border border-slate-200 rounded px-1.5 py-0.5 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-teal-200"
                                  >
                                    <option value="">Unassigned</option>
                                    {t.members.map(m => (
                                      <option key={m.id} value={m.employeeId}>{m.name} ({m.employeeId || "No Code"})</option>
                                    ))}
                                  </select>
                                ) : (
                                  <span className="font-semibold text-slate-700">{t.lead || "Unassigned"}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        {teams.length === 0 && (
                          <p className="text-xs text-slate-400 italic col-span-3 py-4 text-center">No teams found. Click "+ Add Team" to create one.</p>
                        )}
                      </div>
                    </div>

                    {/* Players & Hierarchy list card */}
                    <div className="bg-white border border-orange-100 rounded-2xl p-5 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
                        <div>
                          <h3 className="font-semibold text-slate-900 text-base" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Players & Hierarchy Tree</h3>
                          <p className="text-xs text-slate-400 mt-0.5 font-medium text-slate-500">Explore team rosters grouped by department, with subordinates indented to represent reporting lines.</p>
                        </div>
                         <div className="flex items-center gap-2">
                           <button
                             onClick={() => setIsEditingHierarchy(!isEditingHierarchy)}
                             className={`p-2 rounded-xl border transition-all ${
                               isEditingHierarchy 
                                 ? "bg-teal-500 text-white border-teal-500 shadow-sm" 
                                 : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                             }`}
                             title={isEditingHierarchy ? "Disable Edit Mode" : "Enable Edit Mode"}
                           >
                             <Pencil className="h-4 w-4" />
                           </button>
                         </div>
                      </div>

                      <div className="space-y-6">
                        {teams.map(t => {
                          const teamMembers = t.members;
                          const leadMemberName = t.lead;
                          
                          const renderNode = (member, level = 0) => {
                            const subordinates = teamMembers.filter(m => m.reportingManager === member.name && m.name !== member.name);
                            return (
                              <div key={member.id} className="space-y-2">
                                <div 
                                  className="flex flex-wrap items-center gap-2.5 bg-white hover:bg-slate-50/80 border border-slate-200 rounded-lg py-1.5 px-3 shadow-sm transition-all"
                                  style={{ marginLeft: `${level * 24}px` }}
                                >
                                  {/* Indent line indicator */}
                                  {level > 0 && (
                                    <span className="text-slate-300 font-mono text-xs select-none">└─</span>
                                  )}
                                  
                                  {/* Team Lead Radio Button */}
                                  <div className="flex items-center gap-1 shrink-0" title="Set as Team Lead">
                                    <input 
                                      type="radio" 
                                      name={`team_lead_${t.id}`}
                                      checked={t.lead === member.name} 
                                      onChange={() => handleSetTeamLead(t.id, member.name)}
                                      className="h-3.5 w-3.5 text-teal-600 focus:ring-teal-400 border-slate-300 cursor-pointer"
                                    />
                                    {t.lead === member.name && (
                                      <span className="text-[11px]" title="Team Lead">👑</span>
                                    )}
                                  </div>

                                  {/* Player details */}
                                  <div className="flex-1 min-w-[200px] flex items-center gap-2">
                                    <div className="bg-teal-50 text-teal-700 h-6.5 w-6.5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0">
                                      {member.name.charAt(0)}
                                    </div>
                                    <div className="flex flex-col">
                                      {isEditingHierarchy ? (
                                        <>
                                          <input 
                                            type="text" 
                                            value={member.name}
                                            onChange={(e) => onUpdateMember(member.id, { ...member, teamId: t.id, name: e.target.value })}
                                            className="font-bold text-slate-800 text-xs focus:outline-none bg-transparent hover:bg-slate-100 focus:bg-white rounded px-1 py-0.5 border-none focus:ring-1 focus:ring-teal-200"
                                          />
                                          <div className="flex items-center gap-1.5">
                                            <input 
                                              type="text" 
                                              value={member.designation || ""}
                                              placeholder="Designation"
                                              onChange={(e) => onUpdateMember(member.id, { ...member, teamId: t.id, designation: e.target.value })}
                                              className="text-[10px] text-slate-450 focus:outline-none bg-transparent hover:bg-slate-100 focus:bg-white rounded px-1 py-0.5 border-none focus:ring-1 focus:ring-teal-200 w-32"
                                            />
                                            <span className="text-[10px] text-slate-300">|</span>
                                            <input 
                                              type="text" 
                                              value={member.employeeId || ""}
                                              placeholder="Code"
                                              onChange={(e) => onUpdateMember(member.id, { ...member, teamId: t.id, employeeId: e.target.value })}
                                              className="text-[10px] text-slate-450 font-mono focus:outline-none bg-transparent hover:bg-slate-100 focus:bg-white rounded px-1 py-0.5 border-none focus:ring-1 focus:ring-teal-200 w-20"
                                            />
                                          </div>
                                        </>
                                      ) : (
                                        <div className="flex items-center gap-2">
                                          <span className="font-bold text-slate-800 text-xs">{member.name}</span>
                                          <span className="text-[10px] text-slate-500 font-medium bg-slate-100 px-1.5 py-0.5 rounded">{member.designation || "Player"}</span>
                                          {member.employeeId && (
                                            <span className="text-[9px] text-slate-400 font-mono bg-slate-50 px-1 rounded border border-slate-150">#{member.employeeId}</span>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Experience */}
                                  <div className="flex items-center gap-1 text-slate-500">
                                    {isEditingHierarchy ? (
                                      <>
                                        <span className="text-[10px] text-slate-400">Exp:</span>
                                        <input 
                                          type="number" 
                                          value={member.experience || 0}
                                          onChange={(e) => onUpdateMember(member.id, { ...member, teamId: t.id, experience: parseInt(e.target.value) || 0 })}
                                          className="w-10 border border-slate-200 rounded px-1 py-0.5 text-center text-xs font-mono text-slate-650 focus:outline-none focus:ring-1 focus:ring-teal-200"
                                        />
                                        <span className="text-[10px] text-slate-450">yrs</span>
                                      </>
                                    ) : (
                                      <span className="text-[10px] text-slate-500 font-medium font-mono">Exp: {member.experience || 0} yrs</span>
                                    )}
                                  </div>

                                  {/* Team & Reports To Selectors / Badges */}
                                  {isEditingHierarchy ? (
                                    <>
                                      {/* Team selector */}
                                      <div>
                                        <select 
                                          value={t.id}
                                          onChange={(e) => onUpdateMember(member.id, { ...member, teamId: parseInt(e.target.value) })}
                                          className="border border-slate-200 rounded-lg px-2 py-1 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-teal-300"
                                        >
                                          {teams.map(teamOpt => (
                                            <option key={teamOpt.id} value={teamOpt.id}>{teamOpt.name}</option>
                                          ))}
                                        </select>
                                      </div>

                                      {/* Reporting Manager selector */}
                                      <div>
                                        <select 
                                          value={member.reportingManager || ""}
                                          onChange={(e) => {
                                            const mgrName = e.target.value;
                                            const mgr = allPlayers.find(p => p.name === mgrName);
                                            const targetTeamId = mgr ? mgr.teamId : t.id;
                                            onUpdateMember(member.id, { 
                                              ...member, 
                                              teamId: targetTeamId, 
                                              reportingManager: mgrName 
                                            });
                                          }}
                                          className="border border-slate-200 rounded-lg px-2 py-1 text-xs font-medium text-slate-750 bg-white focus:outline-none focus:ring-1 focus:ring-teal-300"
                                        >
                                          <option value="">No Manager</option>
                                          {managerOptions.filter(mName => mName !== member.name).map(mName => (
                                            <option key={mName} value={mName}>{mName}</option>
                                          ))}
                                        </select>
                                      </div>

                                      {/* Details input */}
                                      <div>
                                        <input 
                                          type="text" 
                                          value={member.description || ""}
                                          placeholder="Additional details"
                                          onChange={(e) => onUpdateMember(member.id, { ...member, teamId: t.id, description: e.target.value })}
                                          className="border border-slate-200 rounded px-1.5 py-0.5 text-xs text-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-200 min-w-[120px]"
                                        />
                                      </div>

                                      {/* Actions */}
                                      <div>
                                        <button
                                          onClick={() => onDeleteMember(member.id)}
                                          className="text-xs text-rose-500 hover:text-rose-600 font-bold hover:underline px-2"
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      {member.reportingManager && (
                                        <span className="text-[10px] text-slate-500 bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded">
                                          Reports to: <span className="font-semibold text-slate-700">{member.reportingManager}</span>
                                        </span>
                                      )}
                                      {member.loginId && (
                                        <span className="text-[10px] text-teal-700 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded font-mono" title="Login ID">
                                          🔑 {member.loginId}
                                        </span>
                                      )}
                                      {member.description && (
                                        <span className="text-[10px] text-slate-400 italic max-w-[180px] truncate" title={member.description}>
                                          ({member.description})
                                        </span>
                                      )}
                                    </>
                                  )}
                                </div>

                                {/* Render subordinates */}
                                {subordinates.map(sub => renderNode(sub, level + 1))}
                              </div>
                            );
                          };

                          const teamMemberNames = new Set(teamMembers.map(m => m.name));
                          const roots = teamMembers.filter(m => m.name === leadMemberName || !teamMemberNames.has(m.reportingManager));
                          const rootsToRender = roots.length > 0 ? roots : teamMembers;

                          return (
                            <div key={t.id} className="border border-slate-100 rounded-2xl p-4 bg-slate-50/10 space-y-3">
                              <div className="flex items-center justify-between border-b border-orange-50 pb-2">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-extrabold text-slate-800 text-sm">📂 {t.name}</span>
                                  <span className="text-[10px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-bold">
                                    {teamMembers.length} Players
                                  </span>
                                </div>
                                <button
                                  onClick={() => {
                                    setActiveTeamId(t.id);
                                    setAddMemberOpen(true);
                                  }}
                                  className="text-[10px] text-teal-650 hover:text-teal-750 font-bold bg-teal-50 hover:bg-teal-100 border border-teal-100 px-2.5 py-1 rounded-lg transition-all shadow-sm"
                                >
                                  + Add Player
                                </button>
                              </div>

                              {teamMembers.length === 0 ? (
                                <p className="text-xs text-slate-400 italic pl-2 py-1">No players assigned to this team yet.</p>
                              ) : (
                                <div className="space-y-2.5">
                                  {rootsToRender.map(r => renderNode(r, 0))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {settingsTab === "spreadsheet" && (
                  <div className="bg-white border border-orange-100 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 text-base" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>KPI Grid Spreadsheet</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Live spreadsheet of your KPIs. Enable edit and double-click cells to edit or add content.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {!isEditingGrid ? (
                      <button 
                        onClick={() => setIsEditingGrid(true)} 
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all shadow-sm"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        <span>Enable Edit</span>
                      </button>
                    ) : (
                      <>
                        <button 
                          onClick={handleSaveGrid}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-teal-500 hover:bg-teal-600 text-white transition-all shadow-sm"
                        >
                          <Download className="h-3.5 w-3.5 rotate-180" />
                          <span>Save Changes</span>
                        </button>
                        <button 
                          onClick={handleCancelEdit}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all shadow-sm"
                        >
                          <span>Cancel</span>
                        </button>
                      </>
                    )}
                    <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600">
                      <Table className="h-4 w-4" />
                      <span>Total Rows: 500</span>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-[600px] overflow-y-auto relative">
                  <table className="w-full text-xs min-w-[2000px] border-collapse bg-white">
                    {/* Excel column labels row (A, B, C...) */}
                    <thead>
                      <tr className="bg-slate-100/70 border-b border-slate-200 text-center text-[10px] text-slate-400 font-mono">
                        <th className="border-r border-slate-200 py-1 sticky left-0 bg-slate-200 z-20" style={{ width: '50px', minWidth: '50px', maxWidth: '50px', left: '0px' }}>A</th>
                        <th className="border-r border-slate-200 py-1 sticky bg-slate-200 z-20" style={{ width: '400px', minWidth: '400px', maxWidth: '400px', left: '50px' }}>B</th>
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
                        <th className="border-r border-slate-200 px-3 py-2 sticky bg-slate-50 z-20" style={{ width: '50px', minWidth: '50px', maxWidth: '50px', left: '0px' }}>KPI no</th>
                        <th className="border-r border-slate-200 px-3 py-2 sticky bg-slate-50 z-20" style={{ width: '400px', minWidth: '400px', maxWidth: '400px', left: '50px' }}>KPI</th>
                        <th className="border-r border-slate-200 px-3 py-2" style={{ width: '180px', minWidth: '180px', maxWidth: '180px' }}>Team</th>
                        <th className="border-r border-slate-200 px-3 py-2" style={{ width: '150px', minWidth: '150px', maxWidth: '150px' }}>DO</th>
                        <th className="border-r border-slate-200 px-3 py-2" style={{ width: '150px', minWidth: '150px', maxWidth: '150px' }}>DRIVE</th>
                        <th className="border-r border-slate-200 px-3 py-2" style={{ width: '150px', minWidth: '150px', maxWidth: '150px' }}>MONITOR</th>
                        <th className="border-r border-slate-200 px-3 py-2" style={{ width: '80px', minWidth: '80px', maxWidth: '80px' }}>UOM</th>
                        <th className="border-r border-slate-200 px-3 py-2" style={{ width: '80px', minWidth: '80px', maxWidth: '80px' }}>UP/Down</th>
                        <th className="border-r border-slate-200 px-3 py-2" style={{ width: '100px', minWidth: '100px', maxWidth: '100px' }}>CY Target</th>
                        {MONTHS_LIST.map(m => (
                          <th key={m} className="border-r border-slate-200 px-2 py-2 text-center" style={{ width: '100px', minWidth: '100px', maxWidth: '100px' }}>{m}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-sans">
                      {gridKpis.map((kpi, idx) => {
                        return (
                          <tr key={kpi.id} className="hover:bg-slate-50/50">
                            {/* A: KPI no */}
                            <td className="border border-slate-200 px-3 py-2 font-mono text-slate-500 sticky bg-white z-10" style={{ width: '50px', minWidth: '50px', maxWidth: '50px', left: '0px' }}>{idx + 1}</td>
                            
                            {/* B: KPI name */}
                            <td className="border border-slate-200 p-0 font-medium text-slate-800 sticky bg-white z-10" style={{ width: '400px', minWidth: '400px', maxWidth: '400px', left: '50px' }}>
                              {renderExcelCell(kpi, "name", kpi.name)}
                            </td>

                            {/* C: Team */}
                            <td className="border border-slate-200 p-0 text-slate-650" style={{ width: '180px', minWidth: '180px', maxWidth: '180px' }}>
                              {renderExcelCell(kpi, "team", kpi.team)}
                            </td>

                            {/* D: Owner */}
                            <td className="border border-slate-200 p-0 text-slate-650" style={{ width: '150px', minWidth: '150px', maxWidth: '150px' }}>
                              {renderExcelCell(kpi, "owner", kpi.owner)}
                            </td>

                            {/* E: Drive */}
                            <td className="border border-slate-200 p-0 text-slate-650" style={{ width: '150px', minWidth: '150px', maxWidth: '150px' }}>
                              {renderExcelCell(kpi, "driveBy", kpi.driveBy || "")}
                            </td>

                            {/* F: Reporting To */}
                            <td className="border border-slate-200 p-0 text-slate-650" style={{ width: '150px', minWidth: '150px', maxWidth: '150px' }}>
                              {renderExcelCell(kpi, "monitorBy", kpi.monitorBy || "")}
                            </td>

                            {/* G: UOM */}
                            <td className="border border-slate-200 p-0 font-semibold text-slate-500 text-center" style={{ width: '80px', minWidth: '80px', maxWidth: '80px' }}>
                              {renderExcelCell(kpi, "unit", kpi.unit.trim())}
                            </td>

                            {/* H: UP/Down */}
                            <td className="border border-slate-200 p-0 text-center" style={{ width: '80px', minWidth: '80px', maxWidth: '80px' }}>
                              {renderExcelCell(kpi, "direction", kpi.direction === "lower" ? "lower" : "higher", "select", 
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${kpi.direction === "lower" ? "bg-orange-50 text-orange-600" : "bg-teal-50 text-teal-600"}`}>
                                  {kpi.direction === "lower" ? "Down" : "UP"}
                                </span>
                              )}
                            </td>

                            {/* I: CY Target */}
                            <td className="border border-slate-200 p-0 font-bold text-slate-800 text-right" style={{ width: '100px', minWidth: '100px', maxWidth: '100px' }}>
                              {renderExcelCell(kpi, "target", kpi.target, "number")}
                            </td>

                            {/* J to U: Monthly target + actual cells */}
                            {MONTHS_LIST.map(m => {
                              const monthKey = m;
                              const targetVal = kpi.monthlyAlloc?.[monthKey] || 0;
                              const actualVal = kpi.monthlyActual?.[monthKey] ?? "";
                              
                              const isEditingTarget = isEditingGrid && editingCell && editingCell.kpiId === kpi.id && editingCell.field === `target_${m}`;
                              const isEditingActual = isEditingGrid && editingCell && editingCell.kpiId === kpi.id && editingCell.field === `actual_${m}`;

                              return (
                                <td key={m} className="border border-slate-200 p-0 text-center" style={{ width: '100px', minWidth: '100px', maxWidth: '100px' }}>
                                  <div className="flex flex-col w-full h-full divide-y divide-slate-200">
                                    {/* Target Row */}
                                    <div className="flex-1 min-h-[22px] flex items-center justify-between px-2 text-[10px] text-slate-500">
                                      <span>T:</span>
                                      {isEditingTarget ? (
                                        <input 
                                          type="number"
                                          value={targetVal}
                                          autoFocus
                                          onBlur={() => setEditingCell(null)}
                                          onKeyDown={(e) => { if (e.key === "Enter") setEditingCell(null); }}
                                          onChange={(e) => handleLocalGridTargetChange(kpi.id, m, e.target.value)}
                                          className="w-16 text-center border border-teal-500 bg-white rounded px-0.5 py-0.2 text-[10px] focus:outline-none font-medium font-mono text-slate-800"
                                        />
                                      ) : (
                                        <span 
                                          onDoubleClick={() => {
                                            if (isEditingGrid) {
                                              setEditingCell({ kpiId: kpi.id, field: `target_${m}` });
                                            }
                                          }}
                                          className={`font-mono font-medium text-slate-650 px-1 ${isEditingGrid ? "cursor-text hover:bg-slate-50" : "cursor-default"}`}
                                          title={isEditingGrid ? "Double click to edit target" : ""}
                                        >
                                          {targetVal}
                                        </span>
                                      )}
                                    </div>
                                    {/* Actual Row */}
                                    <div className="flex-1 min-h-[22px] flex items-center justify-between px-2 text-[10px] text-teal-700 bg-teal-50/20">
                                      <span>A:</span>
                                      {isEditingActual ? (
                                        <input 
                                          type="number"
                                          value={actualVal}
                                          autoFocus
                                          onBlur={() => setEditingCell(null)}
                                          onKeyDown={(e) => { if (e.key === "Enter") setEditingCell(null); }}
                                          onChange={(e) => handleExcelActualChange(kpi, m, e.target.value)}
                                          className="w-16 text-center border border-teal-500 bg-white rounded px-0.5 py-0.2 text-[10px] focus:outline-none font-medium font-mono text-slate-800"
                                        />
                                      ) : (
                                        <span 
                                          onDoubleClick={() => setEditingCell({ kpiId: kpi.id, field: `actual_${m}` })}
                                          className="font-mono font-bold text-teal-850 cursor-text hover:bg-teal-100/50 px-1"
                                          title="Double click to edit actual"
                                        >
                                          {actualVal || "-"}
                                        </span>
                                      )}
                                    </div>
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
            )}

                {settingsTab === "credentials" && (
                  <div className="bg-white border border-orange-100 rounded-2xl p-5 shadow-sm space-y-4">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-base" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>🔐 User Credentials</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Manage login IDs and passwords for each team member. These are used to log in to the Employee view.</p>
                    </div>
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-4 py-2.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Name</th>
                            <th className="px-4 py-2.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Team</th>
                            <th className="px-4 py-2.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Employee ID</th>
                            <th className="px-4 py-2.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Login ID</th>
                            <th className="px-4 py-2.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Password</th>
                            <th className="px-4 py-2.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {allPlayers.map(player => {
                            const isEditingCred = credEditId === player.id;
                            return (
                              <tr key={player.id} className="hover:bg-slate-50/60 transition-colors">
                                <td className="px-4 py-2.5">
                                  <div className="flex items-center gap-2">
                                    <div className="h-7 w-7 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                                      {player.name.charAt(0)}
                                    </div>
                                    <span className="font-semibold text-slate-800 text-xs">{player.name}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-2.5 text-xs text-slate-500">{player.teamName}</td>
                                <td className="px-4 py-2.5 text-xs font-mono text-slate-500">{player.employeeId || "—"}</td>
                                <td className="px-4 py-2.5">
                                  {isEditingCred ? (
                                    <input
                                      type="text"
                                      value={credEditData.loginId}
                                      onChange={e => setCredEditData(prev => ({ ...prev, loginId: e.target.value }))}
                                      className="w-full border border-teal-300 rounded-lg px-2 py-1 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-teal-300"
                                    />
                                  ) : (
                                    <span className="text-xs font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">{player.loginId || player.employeeId || "—"}</span>
                                  )}
                                </td>
                                <td className="px-4 py-2.5">
                                  {isEditingCred ? (
                                    <input
                                      type="text"
                                      value={credEditData.password}
                                      onChange={e => setCredEditData(prev => ({ ...prev, password: e.target.value }))}
                                      className="w-full border border-teal-300 rounded-lg px-2 py-1 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-teal-300"
                                    />
                                  ) : (
                                    <span className="text-xs font-mono text-slate-400">••••••</span>
                                  )}
                                </td>
                                <td className="px-4 py-2.5">
                                  {isEditingCred ? (
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => {
                                          onUpdateMember(player.id, { ...player, loginId: credEditData.loginId, password: credEditData.password });
                                          setCredEditId(null);
                                        }}
                                        className="text-[10px] font-bold text-white bg-teal-500 hover:bg-teal-600 px-2.5 py-1 rounded-lg transition-colors"
                                      >
                                        Save
                                      </button>
                                      <button
                                        onClick={() => setCredEditId(null)}
                                        className="text-[10px] font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        setCredEditId(player.id);
                                        setCredEditData({ loginId: player.loginId || player.employeeId || "", password: player.password || "123" });
                                      }}
                                      className="text-[10px] font-bold text-teal-600 bg-teal-50 hover:bg-teal-100 border border-teal-100 px-2.5 py-1 rounded-lg transition-colors"
                                    >
                                      Edit
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                          {allPlayers.length === 0 && (
                            <tr>
                              <td colSpan={6} className="px-6 py-10 text-center text-xs text-slate-400 italic">No team members found. Add players in the Teams &amp; Players tab first.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
          </div>
        );
      })()}
        </div>
      </main>

      {detailKpi && (
        <KpiDetail kpi={detailKpi} allKpis={kpis} onClose={() => setDetailId(null)} onLog={() => { setLoggingId(detailKpi.id); }} />
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
          allKpis={kpis}
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
        <EditKpiModal kpi={editingKpi} allKpis={kpis} teams={teams} sidebarMinimized={sidebarMinimized} onClose={() => setEditingKpi(null)} onSubmit={onEditKpi} onAddVertical={onAddVertical} onAddMember={onAddMember} />
      )}
      {selectedActiveProject && (
        <ActiveProjectWorkspaceModal
          project={selectedActiveProject}
          kpis={kpis}
          teams={teams}
          onClose={() => setSelectedActiveProject(null)}
          onUpdateProject={(updatedProj) => {
            onAddProject(updatedProj);
            setSelectedActiveProject(updatedProj);
          }}
          onAddTask={(taskData) => {
            handleCompleteAction({
              type: 'create_delegated_task',
              taskData: taskData
            });
          }}
        />
      )}
      {addClientProjectOpen && (
        <AddClientProjectModal
          teams={teams}
          onClose={() => setAddClientProjectOpen(false)}
          onSubmit={(newProj) => {
            onAddClientProject(newProj);
            setAddClientProjectOpen(false);
          }}
        />
      )}
      {editingClientProject && (
        <AddClientProjectModal
          teams={teams}
          project={editingClientProject}
          onClose={() => setEditingClientProject(null)}
          onSubmit={(updatedProj) => {
            onAddClientProject(updatedProj);
            setEditingClientProject(null);
          }}
        />
      )}
      {selectedClientProject && (
        <ClientProjectWorkspaceModal
          project={selectedClientProject}
          kpis={kpis}
          teams={teams}
          onClose={() => setSelectedClientProject(null)}
          onUpdateProject={(updatedProj) => {
            onAddClientProject(updatedProj);
            setSelectedClientProject(updatedProj);
          }}
          onAddTask={(taskData) => {
            handleCompleteAction({
              type: 'create_delegated_task',
              taskData: taskData
            });
          }}
          clientProjectLogs={clientProjectLogs}
          onAddClientProjectLog={onAddClientProjectLog}
        />
      )}
      {columnMapModal && (
        <ExcelColumnMapModal
          modal={columnMapModal}
          onClose={() => setColumnMapModal(null)}
          onConfirm={async (colMap, rows, headerIdx) => {
            try {
              const MONTHS = MONTHS_LIST;
              const get = (row, key) => {
                const idx = colMap[key] !== "" ? parseInt(colMap[key]) : -1;
                return idx >= 0 && row[idx] !== undefined ? String(row[idx]).trim() : "";
              };
              const parsedKpis = [];
              for (let i = headerIdx + 1; i < rows.length; i++) {
                const row = rows[i];
                if (!row || row.length === 0) continue;
                const kpiName = get(row, "kpi");
                if (!kpiName || kpiName === "" || kpiName === "NaN" || kpiName.toLowerCase() === "total") continue;

                const unit = get(row, "uom") ? " " + get(row, "uom") : " Nos";
                const target = parseFloat(get(row, "target")) || 0;
                const dirVal = get(row, "direction").toLowerCase();
                const direction = (dirVal === "down" || dirVal === "lower") ? "lower" : "higher";
                const monthlyAlloc = {};
                const targetsList = [];
                MONTHS.forEach(m => {
                  const key = `month_${m}`;
                  const idx = colMap[key] !== "" ? parseInt(colMap[key]) : -1;
                  if (idx >= 0 && row[idx] !== undefined && row[idx] !== null && row[idx] !== "") {
                    const val = parseFloat(row[idx]);
                    if (!isNaN(val)) {
                      const monthKey = m;
                      monthlyAlloc[monthKey] = val;
                      const rawMonth = m.split(' ')[0];
                      const year = m.split(' ')[1] || (["Jan","Feb","Mar"].includes(rawMonth) ? "2027" : "2026");
                      const monthNum = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].indexOf(rawMonth) + 1;
                      const padMonth = monthNum < 10 ? "0" + monthNum : monthNum;
                      let lastDay = "30";
                      if (["Jan","Mar","May","Jul","Aug","Oct","Dec"].includes(rawMonth)) lastDay = "31";
                      else if (rawMonth === "Feb") lastDay = "28";
                      targetsList.push({ id: monthKey, label: monthKey, targetValue: val, targetDate: `${year}-${padMonth}-${lastDay}` });
                    }
                  }
                });
                const history = [{ d: "W1", v: targetsList.length > 0 ? targetsList[0].targetValue : 0 }];
                parsedKpis.push({
                  name: kpiName,
                  team: get(row, "team") || "General",
                  owner: get(row, "owner") || "",
                  driveBy: get(row, "drive") || "",
                  monitorBy: get(row, "monitor") || "",
                  employeeId: get(row, "empId") || "",
                  unit,
                  target: target || (targetsList.length > 0 ? targetsList[0].targetValue : 0),
                  direction,
                  history,
                  monthlyAlloc,
                  targetsList,
                  targetType: "monthly"
                });
              }
              if (parsedKpis.length === 0) { alert("No valid KPI rows found."); return; }
              if (window.confirm(`Import ${parsedKpis.length} KPIs from this sheet?`)) {
                await onUploadKpis(parsedKpis, { useRowMetadata: true });
                setColumnMapModal(null);
              }
            } catch (err) {
              alert("Import failed: " + err.message);
              console.error(err);
            }
          }}
        />
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
        <p className="text-xl font-semibold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}

/* ==================== EMPLOYEE APP (mobile) ==================== */

const EMP_NAV = [
  { id: "home", icon: Home },
  { id: "action", icon: ListTodo },
  { id: "mykpis", icon: List },
  { id: "team", icon: Trophy },
  { id: "profile", icon: User },
];

const CURRENT_EMPLOYEE = "Anand Kumar";

function EmployeeApp({ kpis, onLog, teams, projects, handleCompleteAction, loggedInUser, onLogout, clientProjects, onUpdateClientProjectStage }) {
  const [screen, setScreen] = useState("home");
  const [detailId, setDetailId] = useState(null);
  const [loggingId, setLoggingId] = useState(null);
  const [shift, setShift] = useState("Excellent");

  const currentEmployee = loggedInUser?.name || CURRENT_EMPLOYEE;

  const myKpis = kpis.filter((k) => k.owner === currentEmployee).sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  const detailKpi = kpis.find((k) => k.id === detailId);
  const loggingKpi = kpis.find((k) => k.id === loggingId);
  const myTeam = teams.find((t) => t.members.some((m) => m.name === currentEmployee));
  const teamKpis = kpis.filter((k) => k.team === myTeam?.name).sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  const onTrackInTeam = teamKpis.filter((k) => getStatus(k) === "on-track").length;
  const todayStr = new Date().toISOString().slice(0, 10);

  /* ── KPI status helpers ── */
  const statusColor = (s) => s === "on-track" ? "bg-teal-100 text-teal-800" : s === "at-risk" ? "bg-orange-100 text-orange-700" : "bg-rose-100 text-rose-700";
  const barColor   = (s) => s === "on-track" ? "bg-teal-400" : s === "at-risk" ? "bg-orange-400" : "bg-rose-400";

  /* ── Sidebar nav item ── */
  const NavItem = ({ item }) => {
    const Icon = item.icon;
    const active = screen === item.id;
    return (
      <button
        onClick={() => setScreen(item.id)}
        className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors ${active ? "bg-teal-50 text-teal-700" : "text-slate-500 hover:bg-slate-50"}`}
      >
        <Icon className="h-5 w-5 shrink-0" />
        <span className="hidden lg:block capitalize">{item.id === "mykpis" ? "My KPIs" : item.id === "action" ? "Actions" : item.id.charAt(0).toUpperCase() + item.id.slice(1)}</span>
      </button>
    );
  };

  /* ── KPI card (reusable) ── */
  const KpiCard = ({ kpi, onClick }) => {
    const status = getStatus(kpi);
    const todayTarget = kpi.dailyAlloc?.[todayStr] || 0;
    const todayActual = kpi.dailyActual?.[todayStr] || 0;
    return (
      <button onClick={onClick} className={`w-full text-left rounded-2xl p-4 border border-transparent hover:border-teal-200 transition-all shadow-sm ${statusColor(status).replace("text-", "").split(" ")[0] === "bg-teal-100" ? "bg-teal-50" : status === "at-risk" ? "bg-orange-50" : "bg-rose-50"}`}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2">{kpi.name}</p>
          <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor(status)}`}>{status === "on-track" ? "On Track" : status === "at-risk" ? "At Risk" : "Off Track"}</span>
        </div>
        <div className="flex items-end justify-between gap-2 mb-2">
          <div>
            <p className="text-2xl font-bold text-slate-900 leading-none">{getLatest(kpi)}<span className="text-sm font-normal text-slate-400 ml-1">{kpi.unit}</span></p>
            <p className="text-xs text-slate-400 mt-0.5">Target: {kpi.target}{kpi.unit}</p>
          </div>
          {todayTarget > 0 && (
            <div className="text-right shrink-0">
              <p className="text-[10px] text-slate-400">Today</p>
              <p className={`text-xs font-bold ${todayActual >= todayTarget ? "text-teal-600" : "text-orange-600"}`}>{todayActual}/{todayTarget}</p>
            </div>
          )}
        </div>
        <div className="h-1.5 rounded-full bg-white/80 overflow-hidden">
          <div className={`h-full rounded-full ${barColor(status)}`} style={{ width: `${Math.min(progressPct(kpi), 100)}%` }} />
        </div>
      </button>
    );
  };

  /* ── Home screen ── */
  const HomeScreen = () => (
    <div className="flex-1 overflow-y-auto">
      {/* Hero header */}
      <div className="relative bg-gradient-to-br from-orange-100 via-orange-50 to-teal-50 px-6 pt-10 pb-8 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 220" preserveAspectRatio="none">
          <circle cx="520" cy="40" r="60" className="fill-orange-200" opacity="0.5" />
          <path d="M0 160 Q200 120 400 155 T600 150 V220 H0 Z" className="fill-orange-200" opacity="0.5" />
          <path d="M0 185 Q180 165 360 180 T600 175 V220 H0 Z" className="fill-teal-100" opacity="0.7" />
        </svg>
        <div className="relative">
          <p className="text-sm font-medium text-orange-900/70" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Hello {currentEmployee.split(" ")[0]}!</p>
          <h1 className="text-2xl md:text-3xl font-bold text-orange-950 mt-0.5" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Have a great shift! 👋</h1>
          <p className="text-xs text-orange-800/60 mt-1">{myTeam?.name} · {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}</p>
          {myKpis[0] && (
            <button onClick={() => setLoggingId(myKpis[0].id)} className="mt-5 bg-white/90 backdrop-blur rounded-2xl p-3.5 flex items-center gap-3 shadow-sm w-full sm:max-w-md text-left hover:shadow-md transition-shadow">
              <div className="h-11 w-11 rounded-xl bg-teal-400 flex items-center justify-center shrink-0">
                <Play className="h-4 w-4 text-white fill-white" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Quick log</p>
                <p className="text-sm font-semibold text-slate-900">{myKpis[0].name}</p>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 px-5 -mt-4 mb-6 relative z-10">
        {[
          { label: "My KPIs", value: myKpis.length, color: "text-teal-700", bg: "bg-white" },
          { label: "On Track", value: myKpis.filter(k => getStatus(k) === "on-track").length, color: "text-emerald-700", bg: "bg-white" },
          { label: "Team KPIs", value: teamKpis.length, color: "text-orange-700", bg: "bg-white" },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl shadow-sm p-3 text-center border border-slate-100`}>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="px-5 pb-6 space-y-6">
        {/* My KPIs preview */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>My KPIs</h2>
            <button onClick={() => setScreen("mykpis")} className="text-xs font-semibold text-teal-600 flex items-center gap-0.5 hover:text-teal-800">View all <ChevronRight className="h-3.5 w-3.5" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {myKpis.slice(0, 6).map(kpi => (
              <KpiCard key={kpi.id} kpi={kpi} onClick={() => setDetailId(kpi.id)} />
            ))}
          </div>
        </div>

        {/* Team card */}
        <button onClick={() => setScreen("team")} className="w-full flex items-center gap-4 bg-orange-50 hover:bg-orange-100 rounded-2xl p-4 transition-colors border border-orange-100">
          <div className="h-12 w-12 rounded-xl bg-orange-300 flex items-center justify-center shrink-0">
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-bold text-slate-900">{myTeam?.name || "My Team"}</p>
            <p className="text-xs text-slate-500 mt-0.5">{onTrackInTeam}/{teamKpis.length} KPIs on track</p>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-400 shrink-0" />
        </button>

        {/* Shift pulse */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <p className="text-sm font-bold text-slate-900 text-center mb-1" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>How did the shift go?</p>
          <p className="text-xs text-slate-400 text-center mb-4">Quick pulse check</p>
          <div className="flex justify-center mb-4">
            <span className="px-5 py-1.5 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold">{shift}</span>
          </div>
          <div className="flex gap-2">
            {["Poor", "Fair", "Good", "Great", "Excellent"].map((opt) => (
              <button key={opt} onClick={() => setShift(opt)}
                className={`flex-1 h-10 rounded-xl flex items-center justify-center text-xs font-semibold border-2 transition-colors ${shift === opt ? "bg-orange-400 border-orange-400 text-white" : "bg-orange-50 border-transparent text-orange-400 hover:border-orange-200"}`}>
                {opt[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  /* ── My KPIs screen ── */
  const MyKpisScreen = () => (
    <div className="flex-1 overflow-y-auto px-5 pt-6 pb-6">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => setScreen("home")} className="text-slate-500 hover:text-slate-700 lg:hidden"><ChevronLeft className="h-5 w-5" /></button>
        <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>My KPIs</h2>
        <span className="ml-auto text-xs text-slate-400 bg-slate-100 rounded-full px-2.5 py-0.5 font-semibold">{myKpis.length}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {myKpis.map(kpi => (
          <KpiCard key={kpi.id} kpi={kpi} onClick={() => setDetailId(kpi.id)} />
        ))}
        {myKpis.length === 0 && (
          <div className="col-span-full text-center py-16 text-slate-400">
            <List className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No KPIs assigned to you yet</p>
          </div>
        )}
      </div>
    </div>
  );

  /* ── Team screen ── */
  const TeamScreen = () => (
    <div className="flex-1 overflow-y-auto px-5 pt-6 pb-6">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => setScreen("home")} className="text-slate-500 hover:text-slate-700 lg:hidden"><ChevronLeft className="h-5 w-5" /></button>
        <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>{myTeam?.name}</h2>
      </div>
      <p className="text-xs text-slate-400 mb-5 ml-8 lg:ml-0">{myTeam?.members.map(m => m.name).join(", ")}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {teamKpis.map(kpi => {
          const allMembers = teams.flatMap(t => t.members);
          const member = allMembers.find(m => m.name === kpi.owner);
          return (
            <button key={kpi.id} onClick={() => setDetailId(kpi.id)} className="w-full bg-orange-50 hover:bg-orange-100 rounded-2xl p-4 text-left border border-transparent hover:border-orange-200 transition-all">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-sm font-semibold text-slate-900 line-clamp-2">{kpi.name}</p>
                <StatusBadge status={getStatus(kpi)} />
              </div>
              <p className="text-xs text-slate-400">{kpi.owner}{member?.reportingManager ? ` · ${member.reportingManager}` : ""}</p>
            </button>
          );
        })}
        {teamKpis.length === 0 && (
          <div className="col-span-full text-center py-16 text-slate-400">
            <Trophy className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No team KPIs found</p>
          </div>
        )}
      </div>
    </div>
  );

  /* ── Profile screen ── */
  const ProfileScreen = () => (
    <div className="flex-1 overflow-y-auto px-5 pt-6 pb-6">
      <div className="flex items-center gap-3 mb-6 lg:hidden">
        <button onClick={() => setScreen("home")} className="text-slate-500 hover:text-slate-700"><ChevronLeft className="h-5 w-5" /></button>
        <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Profile</h2>
      </div>
      <div className="flex flex-col items-center pt-2 pb-8">
        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-orange-200 to-teal-200 flex items-center justify-center text-2xl font-bold text-slate-700 mb-3 shadow-sm">
          {currentEmployee.charAt(0)}{currentEmployee.split(" ")[1]?.charAt(0) || ""}
        </div>
        <p className="font-bold text-lg text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>{currentEmployee}</p>
        <p className="text-xs text-slate-400 mt-0.5">{myTeam?.name} · BULL Machines</p>
      </div>
      <div className="space-y-2 mb-6">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Assigned KPIs</p>
        {myKpis.map(kpi => (
          <div key={kpi.id} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 hover:bg-orange-50 transition-colors">
            <span className="text-sm text-slate-700 font-medium">{kpi.name}</span>
            <StatusBadge status={getStatus(kpi)} />
          </div>
        ))}
      </div>
      {onLogout && (
        <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-500 font-bold py-3.5 rounded-2xl transition-colors text-sm border border-rose-100">
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      )}
    </div>
  );

  const screenMap = { home: <HomeScreen />, mykpis: <MyKpisScreen />, team: <TeamScreen />, action: <ActionScreen kpis={kpis} projects={projects} user={currentEmployee} onCompleteAction={handleCompleteAction} teams={teams} clientProjects={clientProjects} onUpdateClientProjectStage={onUpdateClientProjectStage} />, profile: <ProfileScreen /> };

  return (
    <div className="flex h-full w-full bg-slate-50">

      {/* ── Sidebar nav (md+) ── */}
      <aside className="hidden md:flex flex-col shrink-0 w-14 lg:w-52 bg-white border-r border-slate-100 py-5 px-2 lg:px-3 gap-1">
        {/* Logo / brand */}
        <div className="flex items-center gap-2 px-2 mb-6">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-400 to-teal-400 flex items-center justify-center shrink-0">
            <span className="text-white font-black text-xs">B</span>
          </div>
          <span className="hidden lg:block text-sm font-black text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>BULL KPI</span>
        </div>
        {EMP_NAV.map(item => <NavItem key={item.id} item={item} />)}
        {/* User at bottom */}
        <div className="mt-auto px-2 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0 text-xs font-bold text-orange-700">
              {currentEmployee.charAt(0)}{currentEmployee.split(" ")[1]?.charAt(0) || ""}
            </div>
            <div className="hidden lg:block min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">{currentEmployee}</p>
              <p className="text-[10px] text-slate-400 truncate">{myTeam?.name}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-orange-400 to-teal-400 flex items-center justify-center">
              <span className="text-white font-black text-[10px]">B</span>
            </div>
            <span className="text-sm font-black text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>BULL KPI</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-orange-700">
              {currentEmployee.charAt(0)}{currentEmployee.split(" ")[1]?.charAt(0) || ""}
            </div>
          </div>
        </div>

        {/* Screen content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {screenMap[screen] || <HomeScreen />}
        </div>

        {/* ── Bottom nav (mobile only) ── */}
        <nav className="md:hidden bg-white border-t border-slate-100 px-2 py-2 flex items-center justify-around shrink-0 safe-area-inset-bottom">
          {EMP_NAV.map(item => {
            const Icon = item.icon;
            const active = screen === item.id;
            return (
              <button key={item.id} onClick={() => setScreen(item.id)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${active ? "text-teal-600" : "text-slate-400"}`}>
                <Icon className={`h-5 w-5 ${active ? "stroke-[2.5]" : ""}`} />
                <span className={`text-[9px] font-semibold ${active ? "text-teal-600" : "text-slate-400"}`}>
                  {item.id === "mykpis" ? "KPIs" : item.id === "action" ? "Actions" : item.id.charAt(0).toUpperCase() + item.id.slice(1)}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Modals */}
      {detailKpi && (
        <KpiDetail kpi={detailKpi} allKpis={kpis} onClose={() => setDetailId(null)} onLog={() => setLoggingId(detailKpi.id)} />
      )}
      {loggingKpi && (
        <LogValueModal kpi={loggingKpi} onClose={() => setLoggingId(null)} onSubmit={onLog} />
      )}
    </div>
  );
}

/* ==================== KPI COMPUTATION ENGINE ==================== */
const computeReportKpis = (rawKpis) => {
  const monthsList = MONTHS_LIST;
  
  // Pre-process activity KPIs: Auto-distribute targets if monthlyAlloc is missing but target > 0
  const processedKpis = rawKpis.map(kpi => {
    if (kpi.kpiType === 'report') return kpi;
    const hasAlloc = kpi.monthlyAlloc && Object.values(kpi.monthlyAlloc).some(v => v > 0);
    if (!hasAlloc && kpi.target > 0) {
      const base = Math.floor(kpi.target / 12);
      let remainder = kpi.target % 12;
      const autoMonthly = {};
      monthsList.forEach(m => {
        autoMonthly[m] = base + (remainder > 0 ? 1 : 0);
        if (remainder > 0) remainder--;
      });
      return { ...kpi, monthlyAlloc: autoMonthly };
    }
    return kpi;
  });

  const kpiMap = {};
  processedKpis.forEach(k => kpiMap[k.id] = k);

  return processedKpis.map(kpi => {
    if (kpi.kpiType !== 'report') return kpi;

    const config = kpi.reportConfig || {};
    const op = config.type || 'sum';

    const calcCombined = (ids, extractValFn) => {
      if (!ids || !ids.length) return 0;
      const vals = ids.map(id => kpiMap[id] ? extractValFn(kpiMap[id]) : 0);
      if (op === 'sum') return vals.reduce((a, b) => a + b, 0);
      if (op === 'average') return vals.reduce((a, b) => a + b, 0) / vals.length;
      return 0;
    };

    const calcPercent = (numIds, denIds, extractValFn) => {
      const numSum = (numIds || []).reduce((sum, id) => sum + (kpiMap[id] ? extractValFn(kpiMap[id]) : 0), 0);
      const denSum = (denIds || []).reduce((sum, id) => sum + (kpiMap[id] ? extractValFn(kpiMap[id]) : 0), 0);
      return denSum === 0 ? 0 : Math.round((numSum / denSum) * 100);
    };

    const runCalc = (extractValFn) => {
      if (op === 'percent') {
        return calcPercent(config.numeratorIds, config.denominatorIds, extractValFn);
      }
      return calcCombined(config.kpiIds, extractValFn);
    };

    // Calculate aggregated structures across all keys
    const calcObject = (extractObjFn) => {
      const allKeys = new Set();
      const objects = [];
      rawKpis.forEach(k => {
        const obj = extractObjFn(k) || {};
        objects.push(obj);
        Object.keys(obj).forEach(key => allKeys.add(key));
      });
      
      const res = {};
      allKeys.forEach(key => {
        res[key] = runCalc(k => (extractObjFn(k) || {})[key] || 0);
      });
      return res;
    };

    const newDailyActual = calcObject(k => k.dailyActual);
    const newWeeklyActual = calcObject(k => k.weeklyActual);
    const newMonthlyActual = calcObject(k => k.monthlyActual);

    const newDailyAlloc = calcObject(k => k.dailyAlloc);
    const newWeeklyAlloc = calcObject(k => k.weeklyAlloc);
    const newMonthlyAlloc = calcObject(k => k.monthlyAlloc);

    const newTarget = runCalc(k => k.target);

    // Calculate history
    const allHistoryDates = new Set();
    rawKpis.forEach(k => {
      (k.history || []).forEach(h => allHistoryDates.add(h.d));
    });
    
    const sortedDates = Array.from(allHistoryDates).sort();
    const newHistory = sortedDates.map(dStr => {
      const v = runCalc(k => {
        const h = (k.history || []).find(x => x.d === dStr);
        return h ? h.v : 0;
      });
      return { d: dStr, v };
    });

    return {
      ...kpi,
      target: newTarget,
      dailyActual: newDailyActual,
      weeklyActual: newWeeklyActual,
      monthlyActual: newMonthlyActual,
      dailyAlloc: newDailyAlloc,
      weeklyAlloc: newWeeklyAlloc,
      monthlyAlloc: newMonthlyAlloc,
      history: newHistory
    };
  });
};

/* ==================== ROOT APP ==================== */

export default function App() {
  const [kpis, setKpis] = useState([]);
  const computedKpis = useMemo(() => computeReportKpis(kpis), [kpis]);
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [clientProjects, setClientProjects] = useState([]);
  const [clientProjectLogs, setClientProjectLogs] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(() => {
    try {
      const saved = localStorage.getItem("persistent_user");
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [role, setRole] = useState(() => {
    try {
      const saved = localStorage.getItem("persistent_role");
      return saved || "admin";
    } catch { return "admin"; }
  });
  const [loading, setLoading] = useState(true);
  const [loginForm, setLoginForm] = useState({ loginId: "", password: "" });
  const [loginError, setLoginError] = useState("");

  // Load from Supabase on mount, seed if empty
  useEffect(() => {
    async function loadData() {
      setLoading(true);

      // 1. Fetch Teams
      let dbTeams = null, dbMembers = null;
      try {
        const resTeams = await supabase.from('teams').select('*');
        dbTeams = resTeams.data;
        if (resTeams.error) throw resTeams.error;
        const resMembers = await supabase.from('team_members').select('*');
        dbMembers = resMembers.data;
        if (resMembers.error) throw resMembers.error;
      } catch (netErr) {
        console.warn("Teams offline, reading from localStorage backup:", netErr);
        let cachedTeams = localStorage.getItem("backup_teams");
        if (!cachedTeams) {
          // Initialize mock teams config
          const mockTeams = [
            {
              id: 1,
              name: "Digital Marketing",
              description: "Digital presence & conversion leads",
              lead: "Anand Kumar",
              leadEmployeeId: "EMP001",
              members: [
                { id: 101, name: "Anand Kumar", employeeId: "EMP001", designation: "Team Lead", experience: "5 Yrs", reportingManager: "Ravi", description: "Lead", loginId: "anand", password: "123" },
                { id: 102, name: "Aditi Rao", employeeId: "EMP002", designation: "Social Specialist", experience: "2 Yrs", reportingManager: "Anand Kumar", description: "Design", loginId: "aditi", password: "123" }
              ]
            }
          ];
          localStorage.setItem("backup_teams", JSON.stringify(mockTeams));
          cachedTeams = JSON.stringify(mockTeams);
        }
        setTeams(JSON.parse(cachedTeams));
      }

      if (dbTeams && dbMembers) {
        const loadedTeams = (dbTeams || []).map(t => {
          const leadMember = (dbMembers || []).find(m => m.employee_id === t.employee_id);
          return {
            id: t.id,
            name: t.name,
            description: t.description,
            lead: leadMember ? leadMember.name : (t.lead || "Unassigned"),
            leadEmployeeId: t.employee_id,
            members: (dbMembers || []).filter(m => m.team_id === t.id).map(m => {
              let bio = m.description || "";
              let loginId = m.employee_id || "";
              let password = "123";
              try {
                const parsed = JSON.parse(m.description);
                if (parsed && typeof parsed === "object") {
                  bio = parsed.bio || "";
                  loginId = parsed.loginId || m.employee_id || "";
                  password = parsed.password || "123";
                }
              } catch(e) { /* plain text description */ }
              return {
                id: m.id,
                name: m.name,
                employeeId: m.employee_id,
                designation: m.designation,
                experience: m.experience,
                reportingManager: m.reporting_manager,
                description: bio,
                loginId,
                password
              };
            })
          };
        });
        setTeams(loadedTeams);
        localStorage.setItem("backup_teams", JSON.stringify(loadedTeams));
      }

      // 2. Fetch KPIs
      let dbKpis = null;
      try {
        const resKpis = await supabase.from('kpis').select('*');
        dbKpis = resKpis.data;
        if (resKpis.error) throw resKpis.error;
      } catch (netErr) {
        console.warn("KPIs offline, reading from localStorage backup:", netErr);
        let cachedKpis = localStorage.getItem("backup_kpis");
        if (!cachedKpis) {
          const mockKpis = [
            {
              id: 1,
              name: "No of digital enquiry resulted in sales - Domestic",
              unit: " Nos",
              target: 400.0,
              direction: "higher",
              team: "Digital Marketing",
              owner: "Anand Kumar",
              driveBy: "Aditi Rao",
              monitorBy: "Ravi",
              description: "Domestic Enquiry conversion",
              kra: "Marketing",
              history: [{ d: "W1", v: 10 }, { d: "W2", v: 25 }],
              dailyActual: { "2026-08-22": 5, "2026-08-23": 8 },
              revisedAlloc: {},
              customHolidays: {},
              holidaysEnabled: true,
              targetType: "monthly",
              targetsList: [
                { id: "Aug 2026", label: "Aug 2026", targetValue: 35, targetDate: "2026-08-31" }
              ],
              monthlyAlloc: { "Aug 2026": 35 },
              monthlyActual: { "Aug 2026": 13 },
              weeklyAlloc: {},
              weeklyActual: {},
              dailyAlloc: {},
              kpiType: "activity",
              reportConfig: {}
            }
          ];
          localStorage.setItem("backup_kpis", JSON.stringify(mockKpis));
          cachedKpis = JSON.stringify(mockKpis);
        }
        setKpis(JSON.parse(cachedKpis));
      }

      if (dbKpis) {
        const loadedKpis = dbKpis.map(k => ({
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
          dailyAlloc: k.daily_alloc || {},
          kpiType: k.kpi_type || 'activity',
          reportConfig: k.report_config || {}
        }));
        setKpis(loadedKpis);
        localStorage.setItem("backup_kpis", JSON.stringify(loadedKpis));
      }

      // 3. Fetch Projects
      let dbProjects = null;
      try {
        const resProjects = await supabase.from('projects').select('*');
        dbProjects = resProjects.data;
        if (resProjects.error) throw resProjects.error;
      } catch (netErr) {
        console.warn("Projects offline, reading from localStorage backup:", netErr);
        const cachedProjects = localStorage.getItem("backup_projects");
        if (cachedProjects) {
          setProjects(JSON.parse(cachedProjects));
        }
      }

      const mapDbProjectToUi = (p) => {
        let resultAndImprovement = p.description || "";
        let linkedKpiIds = [];
        let memberNames = [p.lead];
        let targetDate = "";
        let projectStatus = "open";
        let assignedTo = p.lead;
        let kpiId = null;
        let objective = "";
        let companyDetails = "";
        let attachments = [];
        let dailyLogs = [];
        let aiChats = [];
        
        if (p.stages && p.stages.length > 0) {
          targetDate = p.stages[p.stages.length - 1].targetDate || "";
        }

        try {
          const parsed = JSON.parse(p.description);
          if (parsed && typeof parsed === "object") {
            resultAndImprovement = parsed.resultAndImprovement || "";
            linkedKpiIds = parsed.linkedKpiIds || (parsed.linkedKpiId ? [parsed.linkedKpiId] : (parsed.kpiId ? [parsed.kpiId] : []));
            memberNames = parsed.memberNames || [p.lead];
            targetDate = parsed.targetDate || targetDate;
            projectStatus = parsed.status || "open";
            assignedTo = parsed.assignedTo || parsed.assigned_to || p.lead;
            kpiId = parsed.kpiId || parsed.kpi_id || null;
            objective = parsed.objective || "";
            companyDetails = parsed.companyDetails || "";
            attachments = parsed.attachments || [];
            dailyLogs = parsed.dailyLogs || [];
            aiChats = parsed.aiChats || [];
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
          status: projectStatus,
          team: p.team,
          stages: p.stages || [],
          currentStageIdx: p.current_stage_idx || 0,
          assignedTo,
          kpiId,
          objective,
          companyDetails,
          attachments,
          dailyLogs,
          aiChats
        };
      };

      if (dbProjects) {
        const mappedProjs = dbProjects.map(mapDbProjectToUi);
        setProjects(mappedProjs);
        localStorage.setItem("backup_projects", JSON.stringify(mappedProjs));
      }

      // 4. Fetch Client Projects
      let dbClientProjects = null;
      let dbClientProjectLogs = null;
      try {
        const resCP = await supabase.from('client_projects').select('*');
        dbClientProjects = resCP.data;
        if (resCP.error) throw resCP.error;

        const resCPLogs = await supabase.from('client_project_logs').select('*');
        dbClientProjectLogs = resCPLogs.data;
        if (resCPLogs.error) throw resCPLogs.error;
      } catch (netErr) {
        console.warn("Client projects offline, reading backup:", netErr);
        const cachedCP = localStorage.getItem("backup_client_projects");
        if (cachedCP) {
          setClientProjects(JSON.parse(cachedCP));
        }
        const cachedCPLogs = localStorage.getItem("backup_client_project_logs");
        if (cachedCPLogs) {
          setClientProjectLogs(JSON.parse(cachedCPLogs));
        }
      }

      const mapDbClientProjectToUi = (p) => {
        return {
          id: p.id,
          title: p.title,
          description: p.description || "",
          objective: p.objective || "",
          companyDetails: p.company_details || "",
          attachments: p.attachments || [],
          stages: p.stages || [],
          currentStageIdx: p.current_stage_idx || 0,
          aiChats: p.ai_chats || [],
          createdAt: p.created_at
        };
      };

      if (dbClientProjects) {
        const mappedCPs = dbClientProjects.map(mapDbClientProjectToUi);
        setClientProjects(mappedCPs);
        localStorage.setItem("backup_client_projects", JSON.stringify(mappedCPs));
      }
      if (dbClientProjectLogs) {
        const mappedLogs = dbClientProjectLogs.map(l => ({
          id: l.id,
          projectId: l.project_id,
          text: l.log_text,
          author: l.author,
          date: new Date(l.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        }));
        setClientProjectLogs(mappedLogs);
        localStorage.setItem("backup_client_project_logs", JSON.stringify(mappedLogs));
      }

      setLoading(false);
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
    const descJson = JSON.stringify({
      bio: member.description || "",
      loginId: member.loginId || member.employeeId || "",
      password: member.password || "123"
    });
    const { data: memberRow, error } = await supabase.from('team_members').insert({
      team_id: teamId,
      name: member.name,
      employee_id: member.employeeId,
      designation: member.designation,
      experience: member.experience,
      reporting_manager: member.reportingManager,
      description: descJson
    }).select().single();

    if (error) {
      alert("Failed to add player: " + error.message);
      console.error(error);
    } else if (memberRow) {
      const formattedMember = {
        id: memberRow.id,
        name: memberRow.name,
        employeeId: memberRow.employee_id,
        designation: memberRow.designation,
        experience: memberRow.experience,
        reportingManager: memberRow.reporting_manager,
        description: member.description || "",
        loginId: member.loginId || memberRow.employee_id || "",
        password: member.password || "123"
      };
      setTeams((prev) => prev.map((t) => t.id === teamId ? { ...t, members: [...t.members, formattedMember] } : t));
    }
  }

  async function handleDeleteMember(memberId) {
    if (window.confirm("Are you sure you want to remove this player?")) {
      const { error } = await supabase.from('team_members').delete().eq('id', memberId);
      if (error) {
        alert("Error deleting player: " + error.message);
      } else {
        setTeams(prev => prev.map(t => ({
          ...t,
          members: t.members.filter(m => m.id !== memberId)
        })));
      }
    }
  }

  async function handleDeleteTeam(teamId) {
    if (window.confirm("Are you sure you want to delete this team? All players in this team will be unassigned.")) {
      const { error } = await supabase.from('teams').delete().eq('id', teamId);
      if (error) {
        alert("Error deleting team: " + error.message);
      } else {
        setTeams(prev => prev.filter(t => t.id !== teamId));
      }
    }
  }

  async function handleUpdateMember(memberId, updatedFields) {
    // Optimistically update the state
    setTeams(prev => {
      let player = null;
      prev.forEach(t => {
        const found = t.members.find(m => m.id === memberId);
        if (found) player = { ...found };
      });

      if (!player) return prev;

      const nextPlayer = {
        ...player,
        name: updatedFields.name !== undefined ? updatedFields.name : player.name,
        designation: updatedFields.designation !== undefined ? updatedFields.designation : player.designation,
        experience: updatedFields.experience !== undefined ? updatedFields.experience : player.experience,
        reportingManager: updatedFields.reportingManager !== undefined ? updatedFields.reportingManager : player.reportingManager,
        employeeId: updatedFields.employeeId !== undefined ? updatedFields.employeeId : player.employeeId,
        description: updatedFields.description !== undefined ? updatedFields.description : player.description,
        loginId: updatedFields.loginId !== undefined ? updatedFields.loginId : player.loginId,
        password: updatedFields.password !== undefined ? updatedFields.password : player.password
      };

      const nextTeamId = updatedFields.teamId !== undefined ? updatedFields.teamId : player.teamId;

      return prev.map(t => {
        let members = [...t.members];
        const isTargetTeam = t.id === nextTeamId;
        const wasInThisTeam = t.members.some(m => m.id === memberId);

        if (wasInThisTeam && !isTargetTeam) {
          members = members.filter(m => m.id !== memberId);
        } else if (!wasInThisTeam && isTargetTeam) {
          members.push(nextPlayer);
        } else if (wasInThisTeam && isTargetTeam) {
          members = members.map(m => m.id === memberId ? nextPlayer : m);
        }

        return { ...t, members };
      });
    });

    // Build description JSON to persist loginId + password
    let existingBio = updatedFields.description || "";
    let existingLoginId = updatedFields.loginId || updatedFields.employeeId || "";
    let existingPassword = updatedFields.password || "123";
    const descJson = JSON.stringify({ bio: existingBio, loginId: existingLoginId, password: existingPassword });

    // Save background update to database
    const { error } = await supabase.from('team_members').update({
      team_id: updatedFields.teamId,
      name: updatedFields.name,
      designation: updatedFields.designation,
      experience: updatedFields.experience,
      reporting_manager: updatedFields.reportingManager,
      description: descJson,
      employee_id: updatedFields.employeeId
    }).eq('id', memberId);

    if (error) {
      console.error("Error updating player details in Supabase:", error);
      // Reload fresh details on sync failure
      const { data: dbTeams } = await supabase.from('teams').select('*');
      const { data: dbMembers } = await supabase.from('team_members').select('*');
      if (dbTeams) {
        setTeams(dbTeams.map(t => ({
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
        })));
      }
    }
  }

  async function handleSetTeamLead(teamId, leaderEmpId) {
    // Find name corresponding to leaderEmpId
    let leaderName = "Unassigned";
    teams.forEach(t => {
      const found = t.members.find(m => m.employeeId === leaderEmpId);
      if (found) leaderName = found.name;
    });

    // Optimistically update local state
    setTeams(prev => prev.map(t => {
      if (t.id === teamId) {
        return { 
          ...t, 
          lead: leaderName,
          leadEmployeeId: leaderEmpId
        };
      }
      return t;
    }));

    // Update in database (saving the unique Employee ID to the employee_id column)
    const { error } = await supabase.from('teams').update({ employee_id: leaderEmpId }).eq('id', teamId);
    if (error) {
      console.error("Error setting team lead in Supabase:", error);
      // Reload on failure
      const { data: dbTeams } = await supabase.from('teams').select('*');
      const { data: dbMembers } = await supabase.from('team_members').select('*');
      if (dbTeams) {
        setTeams(dbTeams.map(t => {
          const leadMember = (dbMembers || []).find(m => m.employee_id === t.employee_id);
          return {
            id: t.id,
            name: t.name,
            description: t.description,
            lead: leadMember ? leadMember.name : (t.lead || "Unassigned"),
            leadEmployeeId: t.employee_id,
            members: (dbMembers || []).filter(m => m.team_id === t.id).map(m => ({
              id: m.id,
              name: m.name,
              employeeId: m.employee_id,
              designation: m.designation,
              experience: m.experience,
              reportingManager: m.reporting_manager,
              description: m.description
            }))
          };
        }));
      }
    }
  }

  async function handleAddVertical(newVertical) {
    // Generate unique employee ID for the new lead
    const leadEmpCode = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;

    const { data: teamRow } = await supabase.from('teams').insert({
      name: newVertical.name,
      description: newVertical.description,
      lead: newVertical.lead || null, // Stored as name string
      employee_id: newVertical.lead ? leadEmpCode : null // Stored as employee ID
    }).select().single();

    if (teamRow) {
      const createdMembers = [];
      if (newVertical.lead && String(newVertical.lead).trim() !== "") {
        const { data: leadMemberRow } = await supabase.from('team_members').insert({
          team_id: teamRow.id,
          name: newVertical.lead,
          employee_id: leadEmpCode
        }).select().single();

        if (leadMemberRow) {
          createdMembers.push({
            id: leadMemberRow.id,
            name: leadMemberRow.name,
            employeeId: leadMemberRow.employee_id,
            designation: leadMemberRow.designation,
            experience: leadMemberRow.experience,
            reportingManager: leadMemberRow.reporting_manager,
            description: leadMemberRow.description
          });
        }
      }

      const formattedTeam = {
        id: teamRow.id,
        name: teamRow.name,
        description: teamRow.description,
        lead: newVertical.lead || "Unassigned",
        leadEmployeeId: teamRow.lead,
        members: createdMembers
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
      target_type: targetType,
      targets_list: targetsList,
      monthly_alloc: newKpi.monthlyAlloc || {},
      monthly_actual: newKpi.monthlyActual || {},
      weekly_alloc: newKpi.weeklyAlloc || {},
      weekly_actual: newKpi.weeklyActual || {},
      daily_alloc: newKpi.dailyAlloc || {},
      daily_actual: newKpi.dailyActual || {},
      revised_alloc: newKpi.revisedAlloc || {},
      custom_holidays: newKpi.customHolidays || {},
      kpi_type: newKpi.kpiType || 'activity',
      report_config: newKpi.reportConfig || {}
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
        dailyAlloc: kpiRow.daily_alloc || {},
        kpiType: kpiRow.kpi_type || 'activity',
        reportConfig: kpiRow.report_config || {}
      };
      setKpis((prev) => [...prev, formattedKpi]);
    }
  }

  async function handleEditKpi(updatedKpi) {
    if (typeof updatedKpi.id === 'string' && updatedKpi.id.startsWith('temp-')) {
      return handleAddKpi(updatedKpi);
    }

    // 1. Update local React state immediately
    setKpis((prev) => prev.map((k) => k.id === updatedKpi.id ? updatedKpi : k));

    // 2. Always save to localStorage backup (so daily_alloc is never lost)
    try {
      const stored = JSON.parse(localStorage.getItem('backup_kpis') || '[]');
      const idx = stored.findIndex(k => String(k.id) === String(updatedKpi.id));
      const backupRow = {
        id: updatedKpi.id,
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
        target_type: updatedKpi.targetType,
        targets_list: updatedKpi.targetsList,
        monthly_alloc: updatedKpi.monthlyAlloc || {},
        monthly_actual: updatedKpi.monthlyActual || {},
        weekly_alloc: updatedKpi.weeklyAlloc || {},
        weekly_actual: updatedKpi.weeklyActual || {},
        daily_alloc: updatedKpi.dailyAlloc || {},
        daily_actual: updatedKpi.dailyActual || {},
        revised_alloc: updatedKpi.revisedAlloc || {},
        custom_holidays: updatedKpi.customHolidays || {},
        holidays_enabled: updatedKpi.holidaysEnabled ?? true,
        kpi_type: updatedKpi.kpiType || 'activity',
        report_config: updatedKpi.reportConfig || {}
      };
      if (idx >= 0) stored[idx] = backupRow; else stored.push(backupRow);
      localStorage.setItem('backup_kpis', JSON.stringify(stored));
      console.log('[KPI Save] localStorage backup updated for KPI', updatedKpi.id, '| daily_alloc keys:', Object.keys(updatedKpi.dailyAlloc || {}).length);
    } catch (localErr) {
      console.warn('[KPI Save] localStorage backup failed:', localErr);
    }

    // 3. Attempt Supabase save
    try {
      const payload = {
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
        target_type: updatedKpi.targetType,
        targets_list: updatedKpi.targetsList,
        monthly_alloc: updatedKpi.monthlyAlloc || {},
        monthly_actual: updatedKpi.monthlyActual || {},
        weekly_alloc: updatedKpi.weeklyAlloc || {},
        weekly_actual: updatedKpi.weeklyActual || {},
        daily_alloc: updatedKpi.dailyAlloc || {},
        daily_actual: updatedKpi.dailyActual || {},
        revised_alloc: updatedKpi.revisedAlloc || {},
        custom_holidays: updatedKpi.customHolidays || {},
        holidays_enabled: updatedKpi.holidaysEnabled ?? true,
        kpi_type: updatedKpi.kpiType || 'activity',
        report_config: updatedKpi.reportConfig || {}
      };
      console.log('[KPI Save] Attempting Supabase update for KPI', updatedKpi.id, '| daily_alloc:', payload.daily_alloc);
      const { error } = await supabase.from('kpis').update(payload).eq('id', updatedKpi.id);
      if (error) {
        // Check if it's an SSL/network error (common with corporate proxies)
        const isNetworkError = !error.message || error.message.includes('Failed to fetch') ||
          error.message.includes('NetworkError') ||
          error.message.includes('ERR_CERT') ||
          error.message.includes('ERR_CONNECTION') ||
          error.message.includes('fetch');
        if (isNetworkError) {
          console.warn('[KPI Save] Network/SSL error — data saved to localStorage, will sync when online. Error:', error.message);
        } else {
          console.error('[KPI Save] Supabase error in handleEditKpi:', error);
          alert("Failed to save KPI to database: " + error.message);
        }
      } else {
        console.log('[KPI Save] ✅ Supabase save successful for KPI', updatedKpi.id);
      }
    } catch (err) {
      // TypeError: Failed to fetch — network completely down
      console.warn('[KPI Save] Network exception — data saved to localStorage. Error:', err.message);
    }
  }

  async function handleDeleteKpi(id) {
    if (window.confirm("Are you sure you want to delete this KPI? This action cannot be undone.")) {
      setKpis((prev) => prev.filter((k) => k.id !== id));
      await supabase.from('kpis').delete().eq('id', id);
    }
  }

  
  async function handleCompleteAction(actionData) {
    if (actionData.type === 'create_delegated_task') {
      const task = actionData.taskData;
      let teamName = "Digital Marketing";
      const assignedMember = teams.flatMap(t => t.members).find(m => m.name === task.assignee);
      if (assignedMember) {
        const teamObj = teams.find(t => t.members.some(m => m.name === task.assignee));
        if (teamObj) teamName = teamObj.name;
      }
      const descriptionJson = JSON.stringify({
        type: "delegated_task",
        objective: task.objective,
        expectedOutcome: task.outcome,
        targetDate: task.targetDate,
        status: "pending",
        kpiId: task.kpiId || null,
        creator: task.creator,
        rescheduleCount: 0,
        rescheduleReason: "",
        assignedTo: task.assignee,
        isRepetitive: task.isRepetitive || false,
        repetitiveConfig: task.repetitiveConfig || null
      });
      const dbPayload = {
        name: task.title,
        description: descriptionJson,
        team: teamName,
        lead: task.assignee || ""
      };
      const { data, error } = await supabase.from('projects').insert(dbPayload).select().single();
      if (!error && data) {
        setProjects(prev => [...prev, {
          id: data.id,
          title: data.name,
          description: data.description,
          team: data.team,
          assignedTo: task.assignee,
          kpiId: task.kpiId || null,
          targetDate: task.targetDate,
          status: "pending",
          createdAt: data.created_at,
          memberNames: []
        }]);
      } else if (error) {
        console.error("Error creating delegated task:", error);
      }
      return;
    }

    if (actionData.type === 'accept_task') {
      const p = actionData.project;
      let meta = {};
      try { meta = JSON.parse(p.description); } catch(e) {}
      meta.status = "accepted";
      const descriptionJson = JSON.stringify(meta);
      await supabase.from('projects').update({ description: descriptionJson }).eq('id', p.id);
      setProjects(prev => prev.map(proj => proj.id === p.id ? { ...proj, description: descriptionJson, status: "accepted" } : proj));
      return;
    }

    if (actionData.type === 'reschedule_task') {
      const p = actionData.project;
      let meta = {};
      try { meta = JSON.parse(p.description); } catch(e) {}
      meta.status = "accepted";
      meta.targetDate = actionData.newDate;
      meta.rescheduleCount = (meta.rescheduleCount || 0) + 1;
      meta.rescheduleReason = actionData.reason;
      const descriptionJson = JSON.stringify(meta);
      await supabase.from('projects').update({ description: descriptionJson }).eq('id', p.id);
      setProjects(prev => prev.map(proj => proj.id === p.id ? { ...proj, description: descriptionJson, targetDate: actionData.newDate, status: "accepted" } : proj));
      return;
    }

    const isPending = actionData.type === 'pending' || actionData.type === 'delegated_active';
    const isDelayed = actionData.isDelayed || false;
    
    let kpi = kpis.find(k => k.id === actionData.kpiId);
    let assignedTo = isPending ? (actionData.pendingProject?.assignedTo || kpi?.owner) : (kpi?.owner || "Unassigned");
    let teamName = kpi?.team || "Digital Marketing";

    const descriptionJson = JSON.stringify({
      objective: actionData.objective,
      targetDate: actionData.date,
      type: "action_item",
      status: isDelayed ? "delayed" : "completed",
      submissionLink: actionData.submissionLink || "",
      isDelayed: isDelayed,
      delayReason: actionData.delayReason || "",
      assignedTo: assignedTo,
      kpiId: actionData.kpiId || null
    });

    let completedProjectData = null;

    if (isPending) {
      const { data, error } = await supabase.from('projects').update({
        name: actionData.title,
        description: descriptionJson
      }).eq('id', actionData.pendingProject.id).select().single();
      
      if (error) {
        console.error("Error updating pending task:", error);
      }
      completedProjectData = data;
      setProjects(prev => prev.map(p => p.id === actionData.pendingProject.id ? {
        ...p,
        name: actionData.title,
        description: descriptionJson,
        status: isDelayed ? "delayed" : "completed"
      } : p));
    } else {
      const dbPayload = {
        name: actionData.title,
        description: descriptionJson,
        team: teamName,
        lead: assignedTo
      };
      
      const { data, error } = await supabase.from('projects').insert(dbPayload).select().single();
      if (error) {
        console.error("Error inserting completed project:", error);
      }
      completedProjectData = data;
      if (!error && data) {
        const formatted = {
          id: data.id,
          title: data.name,
          description: data.description,
          team: data.team,
          assignedTo: assignedTo,
          kpiId: actionData.kpiId,
          targetDate: actionData.date,
          status: isDelayed ? "delayed" : "completed",
          createdAt: data.created_at,
          memberNames: []
        };
        setProjects(prev => [...prev, formatted]);
      }
    }

    if (!isPending && kpi && !isDelayed) {
      const nextM = { ...(kpi.monthlyActual || {}) };
      const mKey = MONTHS_LIST.find(m => m.startsWith(actionData.date.substring(5,7)) || new Date(actionData.date).toLocaleString('default', { month: 'short' }) + " " + actionData.date.substring(0,4) === m) || Object.keys(kpi.monthlyAlloc || {})[0];
      if (mKey) {
        nextM[mKey] = (nextM[mKey] || 0) + 1;
        setKpis(prev => prev.map(k => k.id === kpi.id ? { ...k, monthlyActual: nextM } : k));
        await supabase.from('kpis').update({ monthly_actual: nextM }).eq('id', kpi.id);
      }
    }

    if (!isPending && actionData.followUpKpiId) {
      const followUpKpi = kpis.find(k => k.id === actionData.followUpKpiId);
      if (followUpKpi) {
        // Calculate child target date with 30-min cutoff buffer shifting logic:
        let targetDateForChild = actionData.date;
        if (kpi && kpi.reportConfig?.handoffEnabled) {
          const now = new Date();
          const cutoffStr = kpi.reportConfig.cutoffTime || "17:30";
          const bufferMins = Number(kpi.reportConfig.bufferMinutes || 30);
          
          const [cutoffHours, cutoffMinutes] = cutoffStr.split(':').map(Number);
          const cutoffDate = new Date(now);
          cutoffDate.setHours(cutoffHours, cutoffMinutes, 0, 0);
          
          const bufferLimitDate = new Date(cutoffDate.getTime() - bufferMins * 60000);
          
          if (now.getTime() >= bufferLimitDate.getTime()) {
            const nextD = new Date(now);
            nextD.setDate(nextD.getDate() + 1);
            targetDateForChild = nextD.toISOString().split('T')[0];
          }
        }

        const followUpDesc = JSON.stringify({
          objective: "Follow-up for: " + actionData.title,
          targetDate: targetDateForChild,
          type: "action_item",
          status: "pending",
          parentLink: actionData.submissionLink || "",
          parentDelayed: isDelayed,
          parentDelayReason: actionData.delayReason || "",
          assignedTo: followUpKpi.owner || "Unassigned",
          kpiId: followUpKpi.id
        });
        const followUpPayload = {
          name: "Pending: " + actionData.title,
          description: followUpDesc,
          team: followUpKpi.team || "Digital Marketing",
          lead: followUpKpi.owner || "Unassigned"
        };
        const { data, error } = await supabase.from('projects').insert(followUpPayload).select().single();
        if (error) {
          console.error("Error creating follow up task:", error);
        }
        if (data) {
          setProjects(prev => [...prev, {
            id: data.id,
            title: data.name,
            description: data.description,
            team: data.team,
            assignedTo: followUpKpi.owner || "Unassigned",
            kpiId: followUpKpi.id,
            targetDate: targetDateForChild,
            status: "pending",
            createdAt: data.created_at,
            memberNames: []
          }]);
        }
      }
    }
  }


  async function handleAddProject(newProject) {
    const isNew = typeof newProject.id === "string" && newProject.id.startsWith("temp-");
    
    const descriptionJson = JSON.stringify({
      resultAndImprovement: newProject.resultAndImprovement,
      linkedKpiIds: newProject.linkedKpiIds || [],
      memberNames: newProject.memberNames,
      targetDate: newProject.targetDate,
      status: newProject.status || "open",
      objective: newProject.objective || "",
      companyDetails: newProject.companyDetails || "",
      attachments: newProject.attachments || [],
      dailyLogs: newProject.dailyLogs || [],
      aiChats: newProject.aiChats || []
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
          currentStageIdx: projectRow.current_stage_idx,
          objective: newProject.objective || "",
          companyDetails: newProject.companyDetails || "",
          attachments: newProject.attachments || [],
          dailyLogs: newProject.dailyLogs || [],
          aiChats: newProject.aiChats || []
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

  async function handleAddClientProject(newProj) {
    const isNew = typeof newProj.id === "string" && newProj.id.startsWith("temp-");
    const dbPayload = {
      title: newProj.title,
      description: newProj.description || "",
      objective: newProj.objective || "",
      company_details: newProj.companyDetails || "",
      attachments: newProj.attachments || [],
      stages: newProj.stages || [],
      current_stage_idx: newProj.currentStageIdx || 0,
      ai_chats: newProj.aiChats || []
    };

    if (isNew) {
      const { data, error } = await supabase.from('client_projects').insert(dbPayload).select().single();
      if (data) {
        const formatted = {
          id: data.id,
          title: data.title,
          description: data.description,
          objective: data.objective,
          companyDetails: data.company_details,
          attachments: data.attachments,
          stages: data.stages,
          currentStageIdx: data.current_stage_idx,
          aiChats: data.ai_chats,
          createdAt: data.created_at
        };
        setClientProjects(prev => {
          const next = [...prev.filter(p => p.id !== newProj.id), formatted];
          localStorage.setItem("backup_client_projects", JSON.stringify(next));
          return next;
        });
      } else if (error) {
        console.error("Error inserting client project in Supabase:", error);
        // Fallback for offline mode
        const localId = Date.now();
        const fallback = { ...newProj, id: localId, createdAt: new Date().toISOString() };
        setClientProjects(prev => {
          const next = [...prev.filter(p => p.id !== newProj.id), fallback];
          localStorage.setItem("backup_client_projects", JSON.stringify(next));
          return next;
        });
      }
    } else {
      setClientProjects(prev => {
        const next = prev.map(p => p.id === newProj.id ? newProj : p);
        localStorage.setItem("backup_client_projects", JSON.stringify(next));
        return next;
      });
      const { error } = await supabase.from('client_projects').update(dbPayload).eq('id', newProj.id);
      if (error) console.error("Error updating client project in Supabase:", error);
    }
  }

  async function handleAddClientProjectLog(projectId, logText) {
    const tempId = Date.now();
    const newLog = {
      id: tempId,
      projectId,
      text: logText,
      author: "Admin",
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };
    setClientProjectLogs(prev => [newLog, ...prev]);

    // Update backup cache
    const nextLogs = [newLog, ...clientProjectLogs];
    localStorage.setItem("backup_client_project_logs", JSON.stringify(nextLogs));

    const { data, error } = await supabase.from('client_project_logs').insert({
      project_id: projectId,
      log_text: logText,
      author: "Admin"
    }).select().single();

    if (data) {
      const formatted = {
        id: data.id,
        projectId: data.project_id,
        text: data.log_text,
        author: data.author,
        date: new Date(data.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      };
      setClientProjectLogs(prev => prev.map(l => l.id === tempId ? formatted : l));
      const updatedLogs = clientProjectLogs.map(l => l.id === tempId ? formatted : l);
      localStorage.setItem("backup_client_project_logs", JSON.stringify(updatedLogs));
    } else if (error) {
      console.error("Error saving log to Supabase:", error);
    }
  }

  async function handleUpdateClientProjectStage(projectId, stageIdx, status, subIdx = null, subSubIdx = null) {
    let updatedStages = [];
    let currentStageIdx = 0;
    
    setClientProjects((prev) => {
      const next = prev.map((proj) => {
        if (proj.id !== projectId) return proj;
        updatedStages = proj.stages.map((stage, idx) => {
          if (idx !== stageIdx) return stage;
          
          if (subIdx === null) {
            // Main stage update
            return { ...stage, status };
          } else if (subSubIdx === null) {
            // Sub stage update
            const updatedSubs = (stage.subStages || []).map((sub, sIdx) => {
              if (sIdx === subIdx) return { ...sub, status };
              return sub;
            });
            return { ...stage, subStages: updatedSubs };
          } else {
            // Sub-sub stage update
            const updatedSubs = (stage.subStages || []).map((sub, sIdx) => {
              if (sIdx !== subIdx) return sub;
              const updatedSubSubs = (sub.subSubStages || []).map((ss, ssIdx) => {
                if (ssIdx === subSubIdx) return { ...ss, status };
                return ss;
              });
              return { ...sub, subSubStages: updatedSubSubs };
            });
            return { ...stage, subStages: updatedSubs };
          }
        });
        
        // Find first pending or current stage index
        const firstActiveIdx = updatedStages.findIndex(s => s.status === "current" || s.status === "pending");
        currentStageIdx = firstActiveIdx !== -1 ? firstActiveIdx : updatedStages.length - 1;
        
        return { ...proj, stages: updatedStages, currentStageIdx };
      });
      localStorage.setItem("backup_client_projects", JSON.stringify(next));
      return next;
    });

    // Run database write
    await supabase.from('client_projects').update({
      stages: updatedStages,
      current_stage_idx: currentStageIdx
    }).eq('id', projectId);
  }

  async function handleDeleteClientProject(id) {
    if (window.confirm("Are you sure you want to delete this Client Project?")) {
      setClientProjects(prev => prev.filter(p => p.id !== id));
      localStorage.setItem("backup_client_projects", JSON.stringify(clientProjects.filter(p => p.id !== id)));
      const { error } = await supabase.from('client_projects').delete().eq('id', id);
      if (error) console.error("Error deleting client project from Supabase:", error);
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

  async function handleDeleteProject(id, force = false) {
    if (force) {
      if (window.confirm("Are you sure you want to PERMANENTLY delete this project? This action cannot be undone.")) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        const { error } = await supabase.from('projects').delete().eq('id', id);
        if (error) console.error("Error deleting project from Supabase:", error);
      }
      return;
    }

    if (window.confirm("Are you sure you want to move this project to the bin? It will wait for admin approval to be permanently removed.")) {
      const proj = projects.find(p => p.id === id);
      if (!proj) return;
      const updatedProj = { ...proj, status: "bin" };
      
      const descriptionJson = JSON.stringify({
        resultAndImprovement: updatedProj.resultAndImprovement,
        linkedKpiIds: updatedProj.linkedKpiIds,
        memberNames: updatedProj.memberNames,
        targetDate: updatedProj.targetDate,
        status: "bin"
      });

      setProjects((prev) => prev.map((p) => p.id === id ? updatedProj : p));
      await supabase.from('projects').update({ description: descriptionJson }).eq('id', id);
    }
  }

  async function handleRestoreProject(id) {
    const proj = projects.find(p => p.id === id);
    if (!proj) return;
    const updatedProj = { ...proj, status: "open" };
    
    const descriptionJson = JSON.stringify({
      resultAndImprovement: updatedProj.resultAndImprovement,
      linkedKpiIds: updatedProj.linkedKpiIds,
      memberNames: updatedProj.memberNames,
      targetDate: updatedProj.targetDate,
      status: "open"
    });

    setProjects((prev) => prev.map((p) => p.id === id ? updatedProj : p));
    await supabase.from('projects').update({ description: descriptionJson }).eq('id', id);
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
      target_type: k.targetType || k.target_type || "monthly",
      targets_list: k.targetsList || k.targets_list || [],
      monthly_alloc: k.monthlyAlloc || k.monthly_alloc || {}
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

  // Login Screen
  if (!loggedInUser) {
    const handleLogin = () => {
      const { loginId, password } = loginForm;
      if (!loginId.trim() || !password.trim()) {
        setLoginError("Please enter your Login ID and Password.");
        return;
      }
      // Admin shortcut
      if (loginId.trim() === "admin" && password.trim() === "admin123") {
        const u = { name: "Admin", loginId: "admin", role: "admin" };
        setLoggedInUser(u);
        setRole("admin");
        localStorage.setItem("persistent_user", JSON.stringify(u));
        localStorage.setItem("persistent_role", "admin");
        setLoginError("");
        return;
      }
      // Match against team members
      const allMembers = teams.flatMap(t => t.members);
      const match = allMembers.find(m =>
        (m.loginId || m.employeeId || "").toLowerCase() === loginId.trim().toLowerCase() &&
        (m.password || "123") === password.trim()
      );
      if (match) {
        const u = { name: match.name, loginId: match.loginId || match.employeeId, role: "employee" };
        setLoggedInUser(u);
        setRole("employee");
        localStorage.setItem("persistent_user", JSON.stringify(u));
        localStorage.setItem("persistent_role", "employee");
        setLoginError("");
      } else {
        setLoginError("Invalid Login ID or Password. Please try again.");
      }
    };

    return (
      <div className="h-screen w-screen bg-gradient-to-b from-orange-50 to-orange-100 flex items-center justify-center p-4" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
        <div className="w-full max-w-sm">
          {/* Logo / Header */}
          <div className="text-center mb-8">
            <div className="h-16 w-16 rounded-2xl bg-teal-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white font-black text-2xl">K</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>PulseKPI</h1>
            <p className="text-sm text-slate-500 mt-1">Sign in to your account</p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-orange-100 p-6 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1.5">Login ID</label>
              <input
                type="text"
                value={loginForm.loginId}
                onChange={e => setLoginForm(prev => ({ ...prev, loginId: e.target.value }))}
                onKeyDown={e => { if (e.key === "Enter") handleLogin(); }}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 font-medium"
                placeholder="Enter your Login ID or Employee ID"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1.5">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={e => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                onKeyDown={e => { if (e.key === "Enter") handleLogin(); }}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 font-medium"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>
            {loginError && (
              <p className="text-xs text-rose-500 font-medium bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">{loginError}</p>
            )}
            <button
              onClick={handleLogin}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-xl transition-colors shadow-sm text-sm"
            >
              Sign In
            </button>
            <p className="text-center text-[10px] text-slate-400 mt-1">
              Contact your admin if you have forgotten your login ID or password.
            </p>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-4">BULL Machines · PulseKPI v1.0</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-orange-50 sm:p-4 flex flex-col overflow-hidden relative" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      {/* Role switcher (only for admin users) */}
      {loggedInUser.role === "admin" && (
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
          <button
            onClick={() => {
              setLoggedInUser(null);
              setLoginForm({ loginId: "", password: "" });
              setLoginError("");
              localStorage.removeItem("persistent_user");
              localStorage.removeItem("persistent_role");
            }}
            title="Logout"
            className="p-2 rounded-full transition-colors text-slate-500 hover:bg-rose-50 hover:text-rose-500 ml-1 border-l border-slate-100"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex-1 w-full h-full flex flex-col min-h-0">
        {(role === "admin" && loggedInUser.role === "admin") ? (
          <AdminApp 
            loggedInUser={loggedInUser}
            kpis={computedKpis} 
            setKpis={setKpis}
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
            onRestoreProject={handleRestoreProject}
            onDeleteMember={handleDeleteMember}
            onDeleteTeam={handleDeleteTeam}
            onUploadKpis={handleUploadKpis}
            handleCompleteAction={handleCompleteAction}
            onUpdateMember={handleUpdateMember}
            clientProjects={clientProjects}
            onAddClientProject={handleAddClientProject}
            onUpdateClientProjectStage={handleUpdateClientProjectStage}
            onDeleteClientProject={handleDeleteClientProject}
            clientProjectLogs={clientProjectLogs}
            onAddClientProjectLog={handleAddClientProjectLog}
          />
        ) : (
          <EmployeeApp 
            kpis={kpis} 
            onLog={handleLog} 
            teams={teams} 
            projects={projects} 
            handleCompleteAction={handleCompleteAction} 
            loggedInUser={loggedInUser} 
            onLogout={() => { setLoggedInUser(null); setLoginForm({ loginId: "", password: "" }); setLoginError(""); localStorage.removeItem("persistent_user"); localStorage.removeItem("persistent_role"); }} 
            clientProjects={clientProjects}
            onUpdateClientProjectStage={handleUpdateClientProjectStage}
          />
        )}
      </div>
    </div>
  );
}
