#!/usr/bin/env python
# Name: Tula Kaptein
# Student number: 11013478

"""
This script converts a .csv file to a .JSON file
"""

import pandas as pd

INPUT_CSV = "nobel_prize_by_winner.csv"
OUTPUT = "nobelPrizeWinners.json"

# df = pd.read_csv(INPUT_CSV, sep=',', usecols=['id', 'firstname', 'surname', 'bornCountry', 'bornCountryCode', 'bornCity', 'diedCountry', 'diedCountryCode', 'diedCity', 'gender', 'year', 'category', 'name', 'city', 'country'])
# df = pd.read_csv(INPUT_CSV, sep=',', usecols=['year', 'category', 'id', 'firstname', 'surname', 'share'])
# df = pd.read_csv(INPUT_CSV, sep=',', header=2)

df.set_index("Country Code", inplace=True)
print(df)
df.to_json(OUTPUT, orient='index')
