import React from "react";
import Tippy from "@tippyjs/react";
import styles from "./RoleSelector.scss";

const RoleList = ({ roles, onSelect }) => (
	<div className={styles.roleList}>
		{roles.map(role => (
			<button key={role.id} className={styles.roleListItem} style={{ color: role.color }} onClick={() => onSelect(role.id)}>
				{role.name}
			</button>
		))}
	</div>
);

const RoleItem = ({ color, name, onRemove }) => (
	<div style={{ borderColor: color }} className={styles.roleItem}>
		<button
			style={{ backgroundColor: color }}
			onClick={onRemove}
			className={styles.removeButton} />
		<span className={styles.roleName}>{name}</span>
	</div>
);

export const RoleSelector = ({ roles, selectedRoleIDs, setSelectedRoleIDs }) => {
	const selectedRoleSet = new Set(selectedRoleIDs);
	const selectedRoles = roles.filter(role => selectedRoleSet.has(role.id));
	const unselectedRoles = roles.filter(role => !selectedRoleSet.has(role.id));

	const selectRole = roleID => setSelectedRoleIDs([...selectedRoleIDs, roleID].sort());

	return (
		<div className={styles.roleSelector}>
			{selectedRoles.map(
				role => <RoleItem
					color={role.color}
					name={role.name}
					key={role.id}
					onRemove={() => setSelectedRoleIDs(selectedRoleIDs.filter(roleID => roleID !== role.id))} />
			)}
			{
				unselectedRoles.length ? <Tippy
					content={<RoleList roles={unselectedRoles} onSelect={selectRole} />}
					theme="role-list"
					trigger="click"
					placement="right"
					interactive={true}
					disabled={unselectedRoles.length === 0} >
					<button className={styles.addRoleButton}>
						<svg>
							<line x1="50%" y1="20%" x2="50%" y2="80%" />
							<line x1="20%" y1="50%" x2="80%" y2="50%" />
						</svg>
					</button>
				</Tippy> : null
			}
		</div>
	);
};
