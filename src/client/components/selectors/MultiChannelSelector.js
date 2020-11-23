import React from "react";
import styles from "./MultiChannelSelector.scss";
import { MultiSelectorBase } from "./MultiSelectorBase";

const ChannelList = ({ items, select }) => (
	<div className={styles.channelSelectionList}>
		{items.map(channel => (
			<button key={channel.id} className={styles.channelSelectionItem} style={{ color: channel.color }} onClick={() => select(channel.id)}>
				<span className={styles.hash}>#</span>{channel.name}
			</button>
		))}
	</div>
);

const ChannelItem = ({ item, unselect }) => (
	<div style={{ borderColor: item.color }} className={styles.channelItem}>
		<button
			onClick={() => unselect(item.id)}
			className={styles.removeButton} />
		<span className={styles.channelName}><span className={styles.hash}>#</span>{item.name}</span>
	</div>
);

export const MultiChannelSelector = ({ channels, selectedChannelIDs, setSelectedChannelIDs }) => {
	const selectedChannelSet = new Set(selectedChannelIDs);
	const selectedChannels = channels.filter(role => selectedChannelSet.has(role.id));
	const unselectedChannels = channels.filter(role => !selectedChannelSet.has(role.id));

	return <MultiSelectorBase
		selectedItems = {selectedChannels}
		unselectedItems= {unselectedChannels}
		ItemComponent = {ChannelItem}
		selectItem = {channelID => setSelectedChannelIDs([...selectedChannelIDs, channelID].sort())}
		unselectItem = {channelID => setSelectedChannelIDs(selectedChannelIDs.filter(id => id !== channelID))}
		SelectionComponent = {ChannelList}
	/>;
};
