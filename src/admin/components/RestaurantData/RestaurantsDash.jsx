import { Box, Card, Typography, CardMedia, CardContent, Button } from "@mui/material"

import {useEffect, useState} from "react"

function RestaurantsDash() {

    const [restaurants, setRestaurants] = useState([])
    const [visibleCount, setVisibleCount] = useState(4)
    const fetchRestaurants = async () => {
        try {
            const response = await fetch("https://tchopshap.onrender.com/restaurant")
            const data = await response.json()
            setRestaurants(data)
        } catch (error) {
            console.error("Erreur lors de la récupération des restaurants:", error)
        }
    }
    useEffect(() => {
        fetchRestaurants()
    }, [])
     const handleVoirPlus = () => {
        setVisibleCount(prev => prev + 4)
    }

    const handleVoirMoins = () => {
        setVisibleCount(4)
    }

    return(
        <div>
            <Box sx={{ p: { xs: 2, md: 3, } }}>
                <Box
                    sx={{
                        display: "grid",
                        gap: 3,
                        gridTemplateColumns: {
                            xs: "repeat(1, 1fr)",
                            sm: "repeat(2, 1fr)",
                            md: "repeat(3, 1fr)",
                            lg: "repeat(4, 1fr)"
                        }, mb:3 
                    }}
                >
                    {restaurants.slice(0, visibleCount).map((restaurant) => (
                        <Card key={restaurant.id}>
                            <CardMedia
                                component="img"
                                alt={restaurant.nom}
                                height="140"
                                image={restaurant.image}/>
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    {restaurant.nom}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {restaurant.details}
                                </Typography>
                                <Typography variant="body2" color="text.primary">
                                    {restaurant.prix} FCFA
                                </Typography>
                            </CardContent>
                        </Card>

                        
                    ))}
                  
                </Box>
                 <Box sx={{ display: "flex",gap:2}}>
                    <Button onClick={handleVoirPlus} variant="contained" color="primary">
                        Voir plus</Button>
                    <Button onClick={handleVoirMoins} variant="contained" color="primary">
                        Voir moins</Button>
                        </Box> 
            </Box>
        </div>
    )
}

export default RestaurantsDash;