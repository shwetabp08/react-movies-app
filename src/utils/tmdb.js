import axios from "axios";

export const fetchTrailerKey = async (movieId, apiKey) => {
  try {
    const res = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=en-US`
    );
    const videos = res.data.results || [];
    // Prioritize official YouTube trailer
    const officialTrailer = videos.find(
      (v) => v.site === "YouTube" && v.type === "Trailer" && v.official
    );
    if (officialTrailer) return officialTrailer.key;

    const anyTrailer = videos.find(
      (v) => v.site === "YouTube" && v.type === "Trailer"
    );
    if (anyTrailer) return anyTrailer.key;

    const teaserOrClip = videos.find(
      (v) => v.site === "YouTube" && (v.type === "Teaser" || v.type === "Clip")
    );
    if (teaserOrClip) return teaserOrClip.key;

    return videos[0]?.site === "YouTube" ? videos[0].key : null;
  } catch (error) {
    console.error("Error fetching trailer:", error);
    return null;
  }
};

export const getImageUrl = (path, size = "w500") => {
  if (!path) return "/Images/blank.png";
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const getBackdropUrl = (path, size = "original") => {
  if (!path) return "/Images/blank.png";
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const formatRating = (rating) => {
  if (!rating && rating !== 0) return "N/A";
  return (Math.round(rating * 10) / 10).toFixed(1);
};

export const calculateMatch = (voteAverage) => {
  if (!voteAverage) return "92%";
  const match = Math.min(99, Math.max(75, Math.round(voteAverage * 10) + 18));
  return `${match}% Match`;
};
