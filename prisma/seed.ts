import { PrismaClient, Scope, TaskStatus, TechnicianRole, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ─── Admin user ──────────────────────────────────────────────────────────
  await prisma.user.upsert({
    where: { email: 'admin@asera.gh' },
    update: {},
    create: {
      email: 'admin@asera.gh',
      name: 'Admin',
      password: await bcrypt.hash('admin123', 10),
      role: UserRole.ADMIN,
    },
  });

  // ─── Sites ───────────────────────────────────────────────────────────────
  const sites = [
    { id: 'accra-central', name: 'Accra Central', location: 'Accra CBD', supervisor: 'Kwaku Mensah', supervisorPhone: '024 555 1234' },
    { id: 'tema-industrial', name: 'Tema Industrial', location: 'Tema Heavy Industrial Area', supervisor: 'Grace Amponsah', supervisorPhone: '020 888 5678' },
    { id: 'east-legon', name: 'East Legon', location: 'East Legon Residential', supervisor: 'Emmanuel Osei', supervisorPhone: '027 333 9012' },
  ];
  for (const site of sites) {
    await prisma.site.upsert({ where: { id: site.id }, update: {}, create: site });
  }

  // ─── HR rates ────────────────────────────────────────────────────────────
  const hrRates = [
    { role: 'Plumber', dailyRateGHS: 120 },
    { role: 'Electrician', dailyRateGHS: 130 },
    { role: 'AC Technician', dailyRateGHS: 150 },
    { role: 'Helper', dailyRateGHS: 80 },
    { role: 'Supervisor', dailyRateGHS: 200 },
  ];
  for (const rate of hrRates) {
    await prisma.hrRate.upsert({ where: { role: rate.role }, update: {}, create: rate });
  }

  // ─── Materials ───────────────────────────────────────────────────────────
  const materials = [
    { id: 'pipe-pvc-1', materialName: 'PVC Pipe 1"', unitCostGHS: 25, unit: 'meter' },
    { id: 'pipe-pvc-2', materialName: 'PVC Pipe 2"', unitCostGHS: 45, unit: 'meter' },
    { id: 'wire-2.5mm', materialName: 'Electrical Wire 2.5mm', unitCostGHS: 8, unit: 'meter' },
    { id: 'wire-4mm', materialName: 'Electrical Wire 4mm', unitCostGHS: 12, unit: 'meter' },
    { id: 'copper-tube', materialName: 'Copper Tube 1/4"', unitCostGHS: 35, unit: 'meter' },
    { id: 'refrigerant', materialName: 'R410A Refrigerant', unitCostGHS: 180, unit: 'kg' },
    { id: 'cement', materialName: 'Cement', unitCostGHS: 85, unit: 'bag' },
    { id: 'breaker-20a', materialName: 'Circuit Breaker 20A', unitCostGHS: 45, unit: 'piece' },
  ];
  for (const m of materials) {
    await prisma.material.upsert({ where: { id: m.id }, update: {}, create: m });
  }

  // ─── Tasks ───────────────────────────────────────────────────────────────
  const tasks = [
    {
      id: 'task-1', siteId: 'accra-central', scope: Scope.PLUMBING,
      taskName: 'Main Water Line Installation', status: TaskStatus.IN_PROGRESS,
      progressPercent: 65, previousProgressPercent: 60,
      estimatedDays: 14, daysElapsed: 9, qualityRating: 4,
      date: '15/04/26', notes: 'Good progress on main line',
      technicians: [
        { name: 'Kofi Mensah', role: TechnicianRole.PLUMBER },
        { name: 'Yaw Asante', role: TechnicianRole.HELPER },
        { name: 'Kwesi Boateng', role: TechnicianRole.HELPER },
      ],
      materialsUsed: [
        { materialId: 'pipe-pvc-2', quantity: 45 },
        { materialId: 'cement', quantity: 3 },
      ],
      comments: [
        { author: 'Site Manager', text: 'Ensure pressure testing is done before backfilling', date: '14/04/26' },
        { author: 'Kofi Mensah', text: 'Additional fittings needed for junction', date: '15/04/26' },
      ],
    },
    {
      id: 'task-2', siteId: 'accra-central', scope: Scope.ELECTRICAL,
      taskName: 'Panel Installation', status: TaskStatus.IN_PROGRESS,
      progressPercent: 40, previousProgressPercent: 35,
      estimatedDays: 10, daysElapsed: 4, qualityRating: 5,
      date: '15/04/26', notes: 'Panel wiring in progress',
      technicians: [
        { name: 'Kwame Adjei', role: TechnicianRole.ELECTRICIAN },
        { name: 'Emmanuel Tetteh', role: TechnicianRole.ELECTRICIAN },
        { name: 'Ama Serwaa', role: TechnicianRole.HELPER },
      ],
      materialsUsed: [
        { materialId: 'wire-4mm', quantity: 120 },
        { materialId: 'breaker-20a', quantity: 8 },
      ],
      comments: [
        { author: 'Kwame Adjei', text: 'Main distribution board ready for inspection', date: '15/04/26' },
      ],
    },
    {
      id: 'task-3', siteId: 'accra-central', scope: Scope.AC_WORKS,
      taskName: 'Ductwork Installation', status: TaskStatus.HALTED,
      progressPercent: 25, previousProgressPercent: 25,
      estimatedDays: 12, daysElapsed: 5, qualityRating: 3,
      date: '15/04/26', notes: 'Waiting for AC units delivery',
      technicians: [
        { name: 'Daniel Osei', role: TechnicianRole.AC_TECHNICIAN },
        { name: 'Prince Amoako', role: TechnicianRole.HELPER },
      ],
      materialsUsed: [{ materialId: 'copper-tube', quantity: 15 }],
      comments: [
        { author: 'Procurement', text: 'AC units expected to arrive 18/04/26', date: '15/04/26' },
        { author: 'Site Manager', text: 'Prioritize other tasks while waiting', date: '15/04/26' },
      ],
    },
    {
      id: 'task-4', siteId: 'tema-industrial', scope: Scope.PLUMBING,
      taskName: 'Industrial Drainage System', status: TaskStatus.IN_PROGRESS,
      progressPercent: 80, previousProgressPercent: 75,
      estimatedDays: 21, daysElapsed: 17, qualityRating: 5,
      date: '15/04/26', notes: 'Nearing completion',
      technicians: [
        { name: 'Samuel Ofori', role: TechnicianRole.PLUMBER },
        { name: 'Isaac Darko', role: TechnicianRole.PLUMBER },
        { name: 'Grace Amponsah', role: TechnicianRole.SUPERVISOR },
      ],
      materialsUsed: [
        { materialId: 'pipe-pvc-2', quantity: 80 },
        { materialId: 'cement', quantity: 8 },
      ],
      comments: [
        { author: 'Grace Amponsah', text: 'Final inspection scheduled for 17/04/26', date: '15/04/26' },
      ],
    },
    {
      id: 'task-5', siteId: 'tema-industrial', scope: Scope.ELECTRICAL,
      taskName: 'High Voltage Wiring', status: TaskStatus.IN_PROGRESS,
      progressPercent: 55, previousProgressPercent: 50,
      estimatedDays: 18, daysElapsed: 10, qualityRating: 4,
      date: '15/04/26', notes: 'Main trunk lines complete',
      technicians: [
        { name: 'Michael Quaye', role: TechnicianRole.ELECTRICIAN },
        { name: 'Peter Annan', role: TechnicianRole.ELECTRICIAN },
        { name: 'Victoria Mensah', role: TechnicianRole.SUPERVISOR },
      ],
      materialsUsed: [
        { materialId: 'wire-4mm', quantity: 200 },
        { materialId: 'breaker-20a', quantity: 15 },
      ],
      comments: [
        { author: 'Michael Quaye', text: 'Need ECG approval for connection point', date: '14/04/26' },
      ],
    },
    {
      id: 'task-6', siteId: 'tema-industrial', scope: Scope.AC_WORKS,
      taskName: 'Industrial Cooling System', status: TaskStatus.IN_PROGRESS,
      progressPercent: 30, previousProgressPercent: 28,
      estimatedDays: 25, daysElapsed: 8, qualityRating: 2,
      date: '15/04/26', notes: 'Quality issues noted',
      technicians: [
        { name: 'Richard Agyeman', role: TechnicianRole.AC_TECHNICIAN },
        { name: 'Frank Boateng', role: TechnicianRole.AC_TECHNICIAN },
        { name: 'Mercy Owusu', role: TechnicianRole.HELPER },
      ],
      materialsUsed: [
        { materialId: 'copper-tube', quantity: 50 },
        { materialId: 'refrigerant', quantity: 5 },
      ],
      comments: [
        { author: 'Quality Inspector', text: 'Rework required on section B joints', date: '15/04/26' },
        { author: 'Site Manager', text: 'Schedule training session for team', date: '15/04/26' },
      ],
    },
    {
      id: 'task-7', siteId: 'east-legon', scope: Scope.PLUMBING,
      taskName: 'Bathroom Fixtures', status: TaskStatus.COMPLETED,
      progressPercent: 100, previousProgressPercent: 95,
      estimatedDays: 7, daysElapsed: 7, qualityRating: 5,
      date: '15/04/26', notes: 'All fixtures installed',
      technicians: [
        { name: 'Joseph Ansah', role: TechnicianRole.PLUMBER },
        { name: 'Eric Owusu', role: TechnicianRole.HELPER },
      ],
      materialsUsed: [{ materialId: 'pipe-pvc-1', quantity: 30 }],
      comments: [
        { author: 'Client', text: 'Very satisfied with the work quality', date: '15/04/26' },
      ],
    },
    {
      id: 'task-8', siteId: 'east-legon', scope: Scope.ELECTRICAL,
      taskName: 'Lighting Circuit', status: TaskStatus.HALTED,
      progressPercent: 45, previousProgressPercent: 45,
      estimatedDays: 8, daysElapsed: 4, qualityRating: 4,
      date: '15/04/26', notes: 'Waiting for light fixtures',
      technicians: [
        { name: 'Benjamin Asare', role: TechnicianRole.ELECTRICIAN },
      ],
      materialsUsed: [{ materialId: 'wire-2.5mm', quantity: 80 }],
      comments: [
        { author: 'Procurement', text: 'LED panels delayed - supplier issue', date: '14/04/26' },
      ],
    },
    {
      id: 'task-9', siteId: 'east-legon', scope: Scope.AC_WORKS,
      taskName: 'Split AC Installation', status: TaskStatus.IN_PROGRESS,
      progressPercent: 70, previousProgressPercent: 60,
      estimatedDays: 6, daysElapsed: 4, qualityRating: 4,
      date: '15/04/26', notes: '3 of 4 units installed',
      technicians: [
        { name: 'Charles Appiah', role: TechnicianRole.AC_TECHNICIAN },
        { name: 'Stephen Frimpong', role: TechnicianRole.HELPER },
      ],
      materialsUsed: [
        { materialId: 'copper-tube', quantity: 25 },
        { materialId: 'refrigerant', quantity: 2 },
      ],
      comments: [
        { author: 'Charles Appiah', text: 'Last unit installation tomorrow morning', date: '15/04/26' },
      ],
    },
  ];

  for (const task of tasks) {
    const { technicians, materialsUsed, comments, ...taskData } = task;
    await prisma.task.upsert({
      where: { id: taskData.id },
      update: {},
      create: {
        ...taskData,
        technicians: { create: technicians },
        materialsUsed: { create: materialsUsed },
        comments: { create: comments },
      },
    });
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
