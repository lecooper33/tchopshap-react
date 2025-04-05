import React from "react";
import{ Container, Typography,Box } from '@mui/material'

function HowItWorks() {

    return(
        <Container sx={{textAlign:'center',backgroundColor:'#F9FAFB', height:'auto'}}>
            <Typography sx={{fontWeight:600, fontSize:30,py:2}}>Comment ça marche</Typography>
            <Typography fontWeight="light" >Commandez votre repas en trois étapes simples et rapides</Typography>
            <Container sx={{display:'flex', width:'100%',  flexWrap:'wrap', justifyContent:'space-between',py:3}}>
{/* premiere box */}
                <Box sx={{ justifyContent:'center',alignItems:'center'}}>
             
{/* conteneur avec le nombre */}
    <Container sx={{width:64, height:64, borderRadius:'50%', py:1,
                          backgroundColor:'#FFEDD5',alignItems:'center', justifyContent:'center',display:'flex'}}>
                             <Typography sx={{fontSize:20,  fontWeight:700, color:'#F97316'}}>1</Typography>
    </Container>
                    <Typography sx={{fontWeight:600,py:1}}>Choisissez un restaurant</Typography>
                    <Typography fontWeight="light" >Parcourez notre sélection de </Typography>
                    <Typography fontWeight="light">restaurants de qualité près de chez </Typography>
                    <Typography fontWeight="light">vous</Typography>
                </Box>
{/* deuxieme box */}
                <Box sx={{  justifyContent:'center',alignItems:'center'}}>
{/* conteneur avec le nombre */}
     <Container sx={{width:64, height:64, borderRadius:'50%', py:1,
                          backgroundColor:'#FFEDD5',alignItems:'center', justifyContent:'center',display:'flex'}}>
                  <Typography sx={{fontSize:20 , fontWeight:700, color:'#F97316'}}>2</Typography>   
        </Container>              
                    <Typography fontWeight="bold" sx={{py:1}}>Sélectionnez vos plats</Typography>
                    <Typography fontWeight="light">Parcourez le menu et ajoutez vos </Typography>
                    <Typography fontWeight="light">plats préférés à votre panier.</Typography>
                </Box>
{/* troisieme box */}
                <Box sx={{ justifyContent:'center',alignItems:'center'}}>
{/* conteneur avec le nombre */}
    <Container sx={{width:64, height:64, borderRadius:'50%', py:1,
                      backgroundColor:'#FFEDD5',alignItems:'center', justifyContent:'center',display:'flex'}}>

        <Typography sx={{fontSize:20, fontWeight:700, color:'#F97316'}}>3</Typography>
    </Container>                    
                    <Typography fontWeight="bold" sx={{py:1}}>Livraison rapide</Typography>
                    <Typography fontWeight="light">Payez en ligne et recevez votre </Typography>
                    <Typography fontWeight="light">commande en un temps record.</Typography>
                </Box>

            </Container>
        </Container>
    )
}

export default HowItWorks