import Header from './components/Header';
import Video from './components/Video';
import { ThemeContextPresenter } from './context/ThemeContextPresenter';
import './styles/Video.scss';

function App() {
	return (
		<div className='app'>
			<ThemeContextPresenter>
				<Header />
				<Video />
			</ThemeContextPresenter>
		</div>
	);
}

export default App;
