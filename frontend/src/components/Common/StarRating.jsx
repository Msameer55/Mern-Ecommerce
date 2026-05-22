import { FaStar } from "react-icons/fa";

const StarRating = ({ rating }) => {
    return (
        <div style={{ display: "flex", gap: "5px" }}>
            {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                    <FaStar
                        key={index}
                        // Fill color depends on if the star's value is <= the rating
                        color={starValue <= rating ? "#ffc107" : "#e4e5e9"}
                        size={20}
                    />
                );
            })}
        </div>
    );
};

export default StarRating;
