import React from "react";
import styles from "./RoleSelector.scss";
import { Selector } from "./Selector";

const RoleList = ({ items, select }) => (
	<div className={styles.roleSelectionList}>
		{items.map(role => (
			<button key={role.id} className={styles.roleSelectionItem} style={{ color: role.color }} onClick={() => select(role.id)}>
				{role.name}
			</button>
		))}
	</div>
);

const RoleItem = ({ item, unselect }) => (
	<div style={{ borderColor: item.color }} className={styles.roleItem}>
		<button
			style={{ backgroundColor: item.color }}
			onClick={() => unselect(item.id)}
			className={styles.removeButton} />
		<span className={styles.roleName}>{item.name}</span>
	</div>
);

export const RoleSelector = ({ roles, selectedRoleIDs, setSelectedRoleIDs }) => {
	const selectedRoleSet = new Set(selectedRoleIDs);
	const selectedRoles = roles.filter(role => selectedRoleSet.has(role.id));
	const unselectedRoles = roles.filter(role => !selectedRoleSet.has(role.id));

	return <Selector
		selectedItems = {selectedRoles}
		unselectedItems= {unselectedRoles}
		ItemComponent = {RoleItem}
		selectItem = {roleID => setSelectedRoleIDs([...selectedRoleIDs, roleID].sort())}
		unselectItem = {roleID => setSelectedRoleIDs(selectedRoleIDs.filter(id => id !== roleID))}
		SelectionComponent = {RoleList}
	/>;
};
