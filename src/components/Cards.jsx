import { Link } from 'react-router'

export function buildImageUrl(imagePath) {
    if (!imagePath) return '';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `http://localhost:8000${normalizedPath}`;
}

export function formatDate(dateValue) {
    if (!dateValue) return '';
    const parsed = new Date(dateValue);
    if (Number.isNaN(parsed.getTime())) return String(dateValue);

    return new Intl.DateTimeFormat('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(parsed);
}

export function CardList({ entries, filteredText }) {
    const cards = entries
        .filter((entry) => entry.title.toLowerCase().includes(filteredText.toLowerCase()))
        .map((entry) => (
            <Card
                id_post={entry.id_post}
                key={entry.id_post}
                id={entry.id_post}
                title={entry.title}
                date={entry.date}
                img={entry.image}
            />
        ));
    return (
        <div className='card-list'>
            {cards}
        </div>
    )
}

export function Card({ id, img, title, date, id_post }) {
    return (
        <div className='card' id={`post-${id}`}>
            <Link className='card-link' to={"/blog/" + id_post}>
                <img src={buildImageUrl(img)} alt={title}></img>
                <h1>{title}</h1>
                <p>{formatDate(date)}</p>
            </Link>
        </div>
    );
}