@echo off
setlocal enabledelayedexpansion

set rarities=Common Uncommon Rare Legendary
set names=Cerberus Hydra Minotaur Phoenix Griffin Basilisk Chimera Kraken Sphinx Cyclops Gorgon Manticore Harpy Leviathan Fenrir Jormungandr NemeanLion Pegasus Medusa Scylla Charybdis Typhon Echidna Orthrus Ladon Hippogriff Banshee Selkie Kelpie Wendigo Yeti Bigfoot Chupacabra Mothman JerseyDevil Thunderbird Peryton Ammit Anubis Bastet Raiju Kitsune Tengu Oni Yurei Nue Bakekujira Jorogumo Kappa YamataNoOrochi Quetzalcoatl Tezcatlipoca Huitzilopochtli Xolotl Tlaloc Cipactli Ahuizotl Camazotz Itzamna Kukulkan AhPuch IxChel Chaac Huracan Zotz Balam Alux Chaneque EkChapat Ixtab Pele Maui Kanaloa Ku Lono Hina Kamohoalii Mooinanea Kane Haumea Tangaroa Rangi Papa Tawhirimatea TaneMahuta Rongo Haumia Ruaumoko MauiTikiti HineNuiTePo Tiki Hineahuone Mahuika Whiro Pania Matariki Tawhaki Uenuku HineMoana Tangotango HineTeIwawa HineTeAparangi HineTeKakara HineTeRangi HineTeWai HineTeWhenua Flufftail Sparkpaw Leafwhisk Stormclaw Blazewing Aquafang Shadowpelt Thunderstrike Frostbite Emberclaw Glimmerhorn Nightshade Sunflare Moonwhisper Starfall Windrider Earthshaker Waterveil Firemane Icefang Rockhide Skysoar Mistwalker Flamepelt Ironclaw Crystalwing Darkshadow Brightspark Swiftstrike Deepsea Lightfeather Thunderroar Frostclaw Emberstorm Glimmerwing Nightglow Sunburst Moonbeam Starshine Windwhisper Earthquake Waterfall Firestorm Iceclaw Rockbreaker Skyglider Mistveil Flamewhisk Ironhide Crystalclaw

set count=0
for %%a in (%names%) do (
    set /a count+=1
    set name[!count!]=%%a
)

set count=0
for %%a in (%rarities%) do (
    set /a count+=1
    set rarity[!count!]=%%a
)

for /l %%i in (1,1,128) do (
    set /a nameIndex=%%i %% 128 + 1
    set /a attack=!random! %% 10 + 1
    set /a defense=!random! %% 10 + 1
    set /a rarityIndex=!random! %% 4 + 1
    set name=!name[!nameIndex!]!
    set rarity=!rarity[!rarityIndex!]!
    echo Name: !name!, Attack: !attack!, Defense: !defense!, Rarity: !rarity!
)

endlocal
pause