export function Home() {
	return (
		<section>
			<h1 style={{ fontSize: '2.75rem', marginBottom: '0.5rem' }}>
				Bienvenido
			</h1>
			<p>¡Bienvenido a mi blog de gatitos!</p>
			<img
				src="./src/assets/bengal.png"
				alt="A cute cat"
				style={{ width: '100%', maxWidth: '800px', borderRadius: '12px' }}
			/>
		</section>
	)
}
