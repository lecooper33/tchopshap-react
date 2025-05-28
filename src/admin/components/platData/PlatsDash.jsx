import { Box, Card, CardContent, CardMedia, Grid, Typography, Button, Stack } from "@mui/material"
import { useEffect, useState } from "react"

function PlatsDash() {
    const [plats, setPlats] = useState([])
    const [visibleCount, setVisibleCount] = useState(4)

    const fetchPlats = async () => {
        try {
            const response = await fetch("https://tchopshap.onrender.com/plat")
            const data = await response.json()
            setPlats(data)
        } catch (error) {
            console.error("Erreur lors de la récupération des plats:", error)
        }
    }

    useEffect(() => {
        fetchPlats()
    }, [])

    const handleVoirPlus = () => {
        setVisibleCount(prev => prev + 4)
    }

    const handleVoirMoins = () => {
        setVisibleCount(4)
    }

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Box
                sx={{
                    display: "grid",
                    gap: 3,
                    gridTemplateColumns: {
                        xs: "repeat(1, 1fr)",
                        sm: "repeat(2, 1fr)",
                        md: "repeat(3, 1fr)",
                        lg: "repeat(4, 1fr)"
                    }
                }}
            >
                {plats.slice(0, visibleCount).map((plat) => (
                    <Card key={plat.id}>
                        <CardMedia
                            component="img"
                            alt={plat.nom}
                            height="140"
                            image={plat.image}
                        />
                        <CardContent>
                            <Typography variant="h6" component="div">
                                {plat.nom}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {plat.details}
                            </Typography>
                            <Typography variant="body2" color="text.primary">
                                {plat.prix} FCFA
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            {(visibleCount < plats.length || visibleCount > 4) && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <Stack direction="row" spacing={2}>
                        {visibleCount < plats.length && (
                            <Button variant="contained" onClick={handleVoirPlus} sx={{backgroundColor:"orange"}}>
                                Voir plus
                            </Button>
                        )}
                        {visibleCount > 4 && (
                        <Button
                        variant="outlined"
                        onClick={handleVoirMoins}
                        sx={{
                          backgroundColor: "white",
                          '&:hover': {backgroundColor: 'orange',}}}>
                        Voir moins
                        </Button>

                        )}
                    </Stack>
                </Box>
            )}
        </Box>
    )
}

export default PlatsDash
