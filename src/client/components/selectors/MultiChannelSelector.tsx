import styles from "./MultiChannelSelector.scss";
import { MultiSelectorBase } from "./MultiSelectorBase";
import { Channel } from "../../types/types";

const ChannelList = ({ items, select }: { items: Channel[], select: (channelID: string) => void } ) => (
	<div className={styles.channelSelectionList}>
		{items.map(channel => (
			<button key={channel.id} className={styles.channelSelectionItem} onClick={() => select(channel.id)}>
				<span className={styles.hash}>#</span>{channel.name}
			</button>
		))}
	</div>
);

const ChannelItem = ({ item, unselect }: { item: Channel, unselect: (channelID: string) => void }) => (
	<div className={styles.channelItem}>
		<button
			onClick={() => unselect(item.id)}
			className={styles.removeButton} />
		<span className={styles.channelName}><span className={styles.hash}>#</span>{item.name}</span>
	</div>
);

type MCSProps = {
	channels: Channel[];
	selectedChannelIDs: string[];
	setSelectedChannelIDs: (ids: string[]) => void;
}

export const MultiChannelSelector = ({ channels, selectedChannelIDs, setSelectedChannelIDs }: MCSProps) => {
	const selectedChannelSet = new Set(selectedChannelIDs);
	const selectedChannels = channels.filter(channel => selectedChannelSet.has(channel.id));
	const unselectedChannels = channels.filter(channel => !selectedChannelSet.has(channel.id));

	return <MultiSelectorBase
		selectedItems = {selectedChannels}
		unselectedItems= {unselectedChannels}
		ItemComponent = {ChannelItem}
		selectItem = {(channelID: string) => setSelectedChannelIDs([...selectedChannelIDs, channelID].sort())}
		unselectItem = {(channelID: string) => setSelectedChannelIDs(selectedChannelIDs.filter(id => id !== channelID))}
		SelectionComponent = {ChannelList}
	/>;
};
