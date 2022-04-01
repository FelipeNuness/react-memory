import { useState, useEffect } from 'react';
import { items } from './data/items';
import * as C from './App.styles';

import logoImage from './assets/devmemory_logo.png';
import RestartIcon from './svgs/restart.svg';

import { Button } from './components/Button';
import { InfoItem } from './components/InfoItem';
import { GridItem } from './components/GridItem';
import { GridItemType } from './types/GridITemType';
import { formatTimeElepsed } from './helpers/formatTimeElepsed';

const App = () => {
	const [playing, setPlaying] = useState<boolean>(false);
	const [timeElapsed, setTimeElapsed] = useState<number>(0);
	const [moveCount, setMoveCount] = useState<number>(0);
	const [shownCount, setShownCount] = useState<number>(0);
	const [gridItems, setGridItems] = useState<GridItemType[]>([]);

	useEffect(() => resetAndCreateGrid(), []);
	useEffect(() => {
		const timer = setInterval(() => {
			if (playing) setTimeElapsed(timeElapsed + 1);
		}, 1000);
		return () => clearInterval(timer);
	}, [playing, timeElapsed]);

	useEffect(() => {
		if (shownCount === 2) {
			const opened = gridItems.filter((item) => item.shown);
			if (opened.length === 2) {
				if (opened[0].item === opened[1].item) {
					const tempGrid = [...gridItems];
					for (const i in tempGrid) {
						if (tempGrid[i].shown) {
							tempGrid[i].permanentShown = true;
							tempGrid[i].shown = false;
						}
					}
					setGridItems(tempGrid);
					setShownCount(0);
				} else {
					setTimeout(() => {
						const tempGrid = [...gridItems];
						for (const i in tempGrid) {
							tempGrid[i].shown = false;
						}
						setGridItems(tempGrid);
						setShownCount(0);
					}, 1000);
				}

				setMoveCount(moveCount + 1);
			}
		}
	}, [shownCount, gridItems]);

	useEffect(() => {
		if (moveCount > 0 && gridItems.every((i) => i.permanentShown))
			setPlaying(false);
	}, [moveCount, gridItems]);

	const resetAndCreateGrid = () => {
		// step 1 - reset game
		setTimeElapsed(0);
		setMoveCount(0);
		setShownCount(0);

		//step 2 - create grid
		const tmpGrid: GridItemType[] = [];

		// create empty gride
		for (let i = 0; i < items.length * 2; i++)
			tmpGrid.push({ item: null, shown: false, permanentShown: false });

		// fiil grid

		for (let w = 0; w < 2; w++) {
			for (let i = 0; i < items.length; i++) {
				let pos = -1;

				while (pos < 0 || tmpGrid[pos].item !== null) {
					pos = Math.floor(Math.random() * (items.length * 2));
				}

				tmpGrid[pos].item = i;
			}
		}

		setGridItems(tmpGrid);
		//step 4 - playing game
		setPlaying(true);
	};

	const handleItemClick = (index: number) => {
		if (playing && index !== null && shownCount < 2) {
			const tempGrid = [...gridItems];

			if (!tempGrid[index].permanentShown && !tempGrid[index].shown) {
				tempGrid[index].shown = true;
				setShownCount(shownCount + 1);
			}

			setGridItems(tempGrid);
		}
	};

	return (
		<C.Container>
			<C.Info>
				<C.LogoLink href=''>
					<img src={logoImage} alt='' width='200' />
				</C.LogoLink>

				<C.InfoArea>
					<InfoItem label='Tempo' value={formatTimeElepsed(timeElapsed)} />
					<InfoItem label='Movimentos' value={moveCount.toString()} />
				</C.InfoArea>

				<Button
					label='Reiniciar'
					icon={RestartIcon}
					onClick={resetAndCreateGrid}
				/>
			</C.Info>

			<C.GridArea>
				<C.Grid>
					{gridItems.map((item, index) => (
						<GridItem
							key={index}
							item={item}
							onClick={() => handleItemClick(index)}
						/>
					))}
				</C.Grid>
			</C.GridArea>
		</C.Container>
	);
};
export default App;
