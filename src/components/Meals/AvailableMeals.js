import Card from '../UI/Card';
import MealItem from './MealItem/MealItem';
import classes from './AvailableMeals.module.css';
import { useEffect, useState } from 'react';

// const DUMMY_MEALS = [
//   {
//     id: 'm1',
//     name: 'Sushi',
//     description: 'Finest fish and veggies',
//     price: 22.99,
//   },
//   {
//     id: 'm2',
//     name: 'Schnitzel',
//     description: 'A german specialty!',
//     price: 16.5,
//   },
//   {
//     id: 'm3',
//     name: 'Barbecue Burger',
//     description: 'American, raw, meaty',
//     price: 12.99,
//   },
//   {
//     id: 'm4',
//     name: 'Green Bowl',
//     description: 'Healthy...and green...',
//     price: 18.99,
//   },
// ];

const AvailableMeals = () => {
	const [meals, setMeals] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [httpError, setHttpError] = useState(null);

	useEffect(() => {
		//sending http request
		//useEffect 함수 첫번째 인수는 함수(nothing or clean up function)를 반환해야되는데 async는 함수로 호출될 수 없는 promise객체를 반환하므로 async를 직접 붙여서 사용할 수 없다.
		//대신, then 사용 or 별도로 async await 함수를 만들어서 호출한다.
		const fetchMeals = async () => {
			setIsLoading(true);
			const response = await fetch('https://react-practice-fetch-movies-default-rtdb.firebaseio.com/meals.json');

			if (!response.ok) {
				throw new Error('Something went wrong');
			}

			const data = await response.json();

			const loadedMeals = [];
			for (const key in data) {
				loadedMeals.push({
					id: key,
					name: data[key].name,
					price: data[key].price,
					description: data[key].description,
				});
			}
			setMeals(loadedMeals);
			setIsLoading(false);
		};

		//handling error
		//위와 같은 이유로 .catch 구문 사용
		fetchMeals().catch((error) => {
			setIsLoading(false);
			setHttpError(error.message);
		});
	}, []);

	if (isLoading) {
		return (
			<section className={classes.MealIsLoading}>
				<p>Loading...</p>
			</section>
		);
	}

	if (httpError) {
		return (
			<section className={classes.MealHasError}>
				<p>{httpError}</p>
			</section>
		);
	}

	const mealsList = meals.map((meal) => <MealItem key={meal.id} id={meal.id} name={meal.name} description={meal.description} price={meal.price} />);

	return (
		<section className={classes.meals}>
			<Card>
				<ul>{mealsList}</ul>
			</Card>
		</section>
	);
};

export default AvailableMeals;
