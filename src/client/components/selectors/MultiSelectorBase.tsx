import type { ComponentType } from "react";
import Tippy from "@tippyjs/react";
import styles from "./MultiSelectorBase.scss";

// TODO: clean up
type Params<T extends { id: string }, K> = {
	selectedItems: T[],
	unselectedItems: T[],
	ItemComponent: ComponentType<{ item: T, unselect: (value: K) => void }>,
	selectItem: (value: K) => void,
	unselectItem: (value: K) => void,
	SelectionComponent: ComponentType<{ items: T[], select: (value: K) => void }>
};

export const MultiSelectorBase = <T extends { id: string }, K>({ selectedItems, unselectedItems, ItemComponent, selectItem, unselectItem, SelectionComponent }: Params<T, K>) => (
	<div className={styles.selector}>
		{selectedItems.map(
			item => <ItemComponent key={item.id} item={item} unselect={unselectItem} />
		)}
		{
			unselectedItems.length ? <Tippy
				content={<SelectionComponent items={unselectedItems} select={selectItem} />}
				theme="selector"
				trigger="click"
				placement="right"
				interactive={true} >
				<button className={styles.selectItemButton}>
					<svg>
						<line x1="50%" y1="20%" x2="50%" y2="80%" />
						<line x1="20%" y1="50%" x2="80%" y2="50%" />
					</svg>
				</button>
			</Tippy> : null
		}
	</div>
);
