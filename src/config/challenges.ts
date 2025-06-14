
export interface Challenge {
  id: number;
  text: string;
  xp: number;
  // This can be used to check against a specific count, e.g. for "complete 5 tasks"
  // This is a flexible way to define challenge requirements.
  check: (completedTasks: any[], categories: Set<string>) => boolean;
}

const completedTasksCount = (count: number) => (completedTasks: any[]) => completedTasks.length >= count;
const urgentTasksCount = (count: number) => (completedTasks: any[]) => completedTasks.filter(t => t.priority === 'urgent').length >= count;
const highPriorityTasksCount = (count: number) => (completedTasks: any[]) => completedTasks.filter(t => t.priority === 'high').length >= count;
const uniqueCategoriesCount = (count: number) => (_: any[], categories: Set<string>) => categories.size >= count;

// 77 Challenges across 11 levels
export const ALL_CHALLENGES_DEFINITIONS: Challenge[] = [
  // Level 1 (Initial)
  { id: 1, text: 'First Step: Complete your first task', xp: 10, check: completedTasksCount(1) },
  { id: 2, text: 'Task Tamer: Complete 5 tasks', xp: 25, check: completedTasksCount(5) },
  { id: 3, text: 'High Priority: Complete an "urgent" priority task', xp: 20, check: urgentTasksCount(1) },
  { id: 4, text: 'Variety Virtuoso: Complete tasks in 3 different categories', xp: 30, check: uniqueCategoriesCount(3) },
  { id: 5, text: 'Task Master: Complete 15 tasks', xp: 50, check: completedTasksCount(15) },
  { id: 6, text: 'Category King: Complete tasks in 5 different categories', xp: 50, check: uniqueCategoriesCount(5) },
  { id: 7, text: 'The Finisher: Complete 25 tasks in total', xp: 100, check: completedTasksCount(25) },
  // Level 2
  { id: 8, text: 'Getting Serious: Complete 40 tasks', xp: 75, check: completedTasksCount(40) },
  { id: 9, text: 'Urgency Expert: Complete 3 urgent tasks', xp: 40, check: urgentTasksCount(3) },
  { id: 10, text: 'Focused Finisher: Complete 5 high-priority tasks', xp: 40, check: highPriorityTasksCount(5) },
  { id: 11, text: 'Workplace Wonder: Complete a task in a "Work" category', xp: 20, check: (_, cats) => cats.has('Work') },
  { id: 12, text: 'Home Hero: Complete a task in a "Home" category', xp: 20, check: (_, cats) => cats.has('Home') },
  { id: 13, text: 'Personal Growth: Complete a task in a "Personal" category', xp: 20, check: (_, cats) => cats.has('Personal') },
  { id: 14, text: 'Financial Wizard: Complete a task in a "Finance" category', xp: 20, check: (_, cats) => cats.has('Finance') },
  // Level 3
  { id: 15, text: 'Dedicated Doer: Complete 60 tasks', xp: 100, check: completedTasksCount(60) },
  { id: 16, text: 'Category Champion: Use 7 distinct categories', xp: 60, check: uniqueCategoriesCount(7) },
  { id: 17, text: 'Pressure Cooker: Complete 5 urgent tasks', xp: 50, check: urgentTasksCount(5) },
  { id: 18, text: 'Top Performer: Complete 10 high-priority tasks', xp: 50, check: highPriorityTasksCount(10) },
  { id: 19, text: 'Health Nut: Complete a task in a "Health" category', xp: 25, check: (_, cats) => cats.has('Health') },
  { id: 20, text: 'Social Butterfly: Complete a task in a "Social" category', xp: 25, check: (_, cats) => cats.has('Social') },
  { id: 21, text: 'Study Buddy: Complete a task in a "Study" category', xp: 25, check: (_, cats) => cats.has('Study') },
  // Level 4
  { id: 22, text: 'Relentless: Complete 80 tasks', xp: 125, check: completedTasksCount(80) },
  { id: 23, text: 'Urgent Juggernaut: Complete 10 urgent tasks', xp: 70, check: urgentTasksCount(10) },
  { id: 24, text: 'Priority Planner: Complete 15 high-priority tasks', xp: 70, check: highPriorityTasksCount(15) },
  { id: 25, text: 'Task Juggler: Use 10 distinct categories', xp: 80, check: uniqueCategoriesCount(10) },
  { id: 26, text: 'Hobbyist: Complete a task in a "Hobby" category', xp: 30, check: (_, cats) => cats.has('Hobby') },
  { id: 27, text: 'Traveler: Complete a task in a "Travel" category', xp: 30, check: (_, cats) => cats.has('Travel') },
  { id: 28, text: 'Project Pro: Complete a task in a "Project" category', xp: 30, check: (_, cats) => cats.has('Project') },
  // Level 5
  { id: 29, text: 'Centurion: Complete 100 tasks', xp: 150, check: completedTasksCount(100) },
  { id: 30, text: 'Five-Star General: Complete 15 urgent tasks', xp: 90, check: urgentTasksCount(15) },
  { id: 31, text: 'Elite Executer: Complete 20 high-priority tasks', xp: 90, check: highPriorityTasksCount(20) },
  { id: 32, text: 'Diverse Skillset: Use 12 distinct categories', xp: 100, check: uniqueCategoriesCount(12) },
  { id: 33, text: 'Creative Mind: Complete a task in a "Creative" category', xp: 35, check: (_, cats) => cats.has('Creative') },
  { id: 34, text: 'Tech Savvy: Complete a task in a "Tech" category', xp: 35, check: (_, cats) => cats.has('Tech') },
  { id: 35, text: 'Volunteer: Complete a task in a "Volunteering" category', xp: 35, check: (_, cats) => cats.has('Volunteering') },
  // Level 6
  { id: 36, text: 'Power Player: Complete 125 tasks', xp: 175, check: completedTasksCount(125) },
  { id: 37, text: 'Urgent Response Team: Complete 20 urgent tasks', xp: 110, check: urgentTasksCount(20) },
  { id: 38, text: 'High-Stakes Achiever: Complete 25 high-priority tasks', xp: 110, check: highPriorityTasksCount(25) },
  { id: 39, text: 'Master of All Trades: Use 15 distinct categories', xp: 120, check: uniqueCategoriesCount(15) },
  { id: 40, text: 'DIY Expert: Complete a task in a "DIY" category', xp: 40, check: (_, cats) => cats.has('DIY') },
  { id: 41, text: 'Event Planner: Complete a task in an "Events" category', xp: 40, check: (_, cats) => cats.has('Events') },
  { id: 42, text: 'Researcher: Complete a task in a "Research" category', xp: 40, check: (_, cats) => cats.has('Research') },
  // Level 7
  { id: 43, text: 'Unstoppable: Complete 150 tasks', xp: 200, check: completedTasksCount(150) },
  { id: 44, text: 'Crisis Manager: Complete 25 urgent tasks', xp: 130, check: urgentTasksCount(25) },
  { id: 45, text: 'Peak Performer: Complete 30 high-priority tasks', xp: 130, check: highPriorityTasksCount(30) },
  { id: 46, text: 'The Collector: Use 18 distinct categories', xp: 140, check: uniqueCategoriesCount(18) },
  { id: 47, text: 'Networking Guru: Complete a task in a "Networking" category', xp: 45, check: (_, cats) => cats.has('Networking') },
  { id: 48, text: 'Maintenance Maestro: Complete a task in a "Maintenance" category', xp: 45, check: (_, cats) => cats.has('Maintenance') },
  { id: 49, text: 'Language Learner: Complete a task in a "Language" category', xp: 45, check: (_, cats) => cats.has('Language') },
  // Level 8
  { id: 50, text: 'Task Titan: Complete 175 tasks', xp: 225, check: completedTasksCount(175) },
  { id: 51, text: 'Calm Under Pressure: Complete 30 urgent tasks', xp: 150, check: urgentTasksCount(30) },
  { id: 52, text: 'Strategic Thinker: Complete 35 high-priority tasks', xp: 150, check: highPriorityTasksCount(35) },
  { id: 53, text: 'Encyclopedic: Use 20 distinct categories', xp: 160, check: uniqueCategoriesCount(20) },
  { id: 54, text: 'Athlete: Complete a task in a "Sports" category', xp: 50, check: (_, cats) => cats.has('Sports') },
  { id: 55, text: 'Musician: Complete a task in a "Music" category', xp: 50, check: (_, cats) => cats.has('Music') },
  { id: 56, text: 'Writer: Complete a task in a "Writing" category', xp: 50, check: (_, cats) => cats.has('Writing') },
  // Level 9
  { id: 57, text: 'Living Legend: Complete 200 tasks', xp: 250, check: completedTasksCount(200) },
  { id: 58, text: 'Emergency Services: Complete 35 urgent tasks', xp: 170, check: urgentTasksCount(35) },
  { id: 59, text: 'Visionary: Complete 40 high-priority tasks', xp: 170, check: highPriorityTasksCount(40) },
  { id: 60, text: 'The Curator: Use 22 distinct categories', xp: 180, check: uniqueCategoriesCount(22) },
  { id: 61, text: 'Gamer: Complete a task in a "Gaming" category', xp: 55, check: (_, cats) => cats.has('Gaming') },
  { id: 62, text: 'Chef: Complete a task in a "Cooking" category', xp: 55, check: (_, cats) => cats.has('Cooking') },
  { id: 63, text: 'Gardener: Complete a task in a "Gardening" category', xp: 55, check: (_, cats) => cats.has('Gardening') },
  // Level 10
  { id: 64, text: 'Task Demigod: Complete 250 tasks', xp: 300, check: completedTasksCount(250) },
  { id: 65, text: 'Time Lord: Complete 40 urgent tasks', xp: 200, check: urgentTasksCount(40) },
  { id: 66, text: 'Grandmaster: Complete 50 high-priority tasks', xp: 200, check: highPriorityTasksCount(50) },
  { id: 67, text: 'Renaissance Person: Use 25 distinct categories', xp: 200, check: uniqueCategoriesCount(25) },
  { id: 68, text: 'Astronomer: Complete a task in an "Astronomy" category', xp: 60, check: (_, cats) => cats.has('Astronomy') },
  { id: 69, text: 'Philosopher: Complete a task in a "Philosophy" category', xp: 60, check: (_, cats) => cats.has('Philosophy') },
  { id: 70, text: 'Explorer: Complete a task in an "Exploration" category', xp: 60, check: (_, cats) => cats.has('Exploration') },
   // Level 11
  { id: 71, text: 'Deity of Doing: Complete 300 tasks', xp: 350, check: completedTasksCount(300) },
  { id: 72, text: 'Master of Urgency: Complete 50 urgent tasks', xp: 250, check: urgentTasksCount(50) },
  { id: 73, text: 'Ultimate Prioritizer: Complete 60 high-priority tasks', xp: 250, check: highPriorityTasksCount(60) },
  { id: 74, text: 'Universal Knowledge: Use 30 distinct categories', xp: 250, check: uniqueCategoriesCount(30) },
  { id: 75, text: 'Philanthropist: Complete a task in a "Charity" category', xp: 75, check: (_, cats) => cats.has('Charity') },
  { id: 76, text: 'Inventor: Complete a task in an "Invention" category', xp: 75, check: (_, cats) => cats.has('Invention') },
  { id: 77, text: 'The Final Challenge: Complete a task in the "Legacy" category', xp: 500, check: (_, cats) => cats.has('Legacy') },
];
