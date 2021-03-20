export const JoinedProject = (name, project) =>
	`${name} just joined ${project}`;

export const NewTask = (manager, task) =>
	`Manager ${manager} just added ${task} task`;

export const NewMileStone = (manager, milestone) =>
	`Manager ${manager} just added ${milestone} milestone`;

export const toggleTask = (task, oldStatus, newStatus, manager) =>
	`Manager ${manager} just moved ${task} from ${oldStatus} to ${newStatus}`;
