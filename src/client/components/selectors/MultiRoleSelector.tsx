import { Role } from "../../types/types";
import styles from "./MultiRoleSelector.scss";
import { MultiSelectorBase } from "./MultiSelectorBase";

const RoleList = ({ items, select }: { items: Role[], select: (roleID: string) => void } ) => (
	<div className={styles.roleSelectionList}>
		{items.map(role => (
			<button key={role.id} className={styles.roleSelectionItem} style={{ color: role.color }} onClick={() => select(role.id)}>
				{role.name}
			</button>
		))}
	</div>
);

const RoleItem = ({ item, unselect }: { item: Role, unselect: (roleID: string) => void }) => (
	<div style={{ borderColor: item.color }} className={styles.roleItem}>
		<button
			style={{ backgroundColor: item.color }}
			onClick={() => unselect(item.id)}
			className={styles.removeButton} />
		<span className={styles.roleName}>{item.name}</span>
	</div>
);

type MRSProps = {
	roles: Role[];
	selectedRoleIDs: string[];
	setSelectedRoleIDs: (ids: string[]) => void;
}

export const MultiRoleSelector = ({ roles, selectedRoleIDs, setSelectedRoleIDs }: MRSProps) => {
	const selectedRoleSet = new Set(selectedRoleIDs);
	const selectedRoles = roles.filter(role => selectedRoleSet.has(role.id));
	const unselectedRoles = roles.filter(role => !selectedRoleSet.has(role.id));

	return <MultiSelectorBase
		selectedItems = {selectedRoles}
		unselectedItems= {unselectedRoles}
		ItemComponent = {RoleItem}
		selectItem = {(roleID: string) => setSelectedRoleIDs([...selectedRoleIDs, roleID].sort())}
		unselectItem = {(roleID: string) => setSelectedRoleIDs(selectedRoleIDs.filter(id => id !== roleID))}
		SelectionComponent = {RoleList}
	/>;
};
