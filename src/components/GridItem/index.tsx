import { GridItemType } from '../../types/GridITemType';
import * as C from './styles';
import b7Svg from '../../svgs/b7.svg';
import { items } from '../../data/items';

type Props = {
	item: GridItemType;
	onClick: () => void;
};
export const GridItem = ({ item, onClick }: Props) => {
	return (
		<C.Container
			onClick={onClick}
			showBackground={item.permanentShown || item.shown}>
			{item.permanentShown === false && item.shown === false && (
				<C.Icon opacity={0.1} src={b7Svg} alt='' />
			)}
			{(item.permanentShown || item.shown) && item.item !== null && (
				<C.Icon src={items[item.item].icon} alt='' />
			)}
		</C.Container>
	);
};
