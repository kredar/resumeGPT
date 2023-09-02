# Import packages
from dash import Dash, html, dash_table, dcc, callback, Output, Input
import pandas as pd
import plotly.express as px
import dash_mantine_components as dmc

# Incorporate data
df = pd.read_csv('~/Downloads/app_reviews_data_openai_last100_02052023.csv')

df = df.drop(['userImage','date','time','year','month','Unnamed: 0','Unnamed: 0.1'], axis=1)

# Initialize the app
app = Dash(__name__)

# App layout
app.layout = html.Div([
    html.Div(children='My First App with Data'),
    dash_table.DataTable(
    data=df.to_dict('records'), page_size=10,
    columns=[{'id': x, 'name': x, 'presentation': 'markdown'} if x == 'reviews_link' else {'id': x, 'name': x} for x in df.columns],
    style_cell={'textAlign': 'left'},
    style_data={
        'whiteSpace': 'normal',
        'height': 'auto',
    }
    ),
])


# # Initialize the app - incorporate a Dash Mantine theme
# external_stylesheets = [dmc.theme.DEFAULT_COLORS]
# app = Dash(__name__, external_stylesheets=external_stylesheets)

# # App layout
# app.layout = dmc.Container([
#     dmc.Title('Android App Reviews', color="blue", size="h3"),
#     dmc.RadioGroup(
#             [dmc.Radio(i, value=i) for i in  ['pop', 'lifeExp', 'gdpPercap']],
#             id='my-dmc-radio-item',
#             value='lifeExp',
#             size="sm"
#         ),
#     dmc.Grid([
#         dmc.Col([
#             dash_table.DataTable(data=df.to_dict('records'), page_size=20, style_table={'overflowX': 'auto', 'height':'auto'})
#         ], span=6),
#         dmc.Col([
#             dcc.Graph(figure={}, id='graph-placeholder')
#         ], span=6),
#     ]),




# ], fluid=True)

# # Add controls to build the interaction
# @callback(
#     Output(component_id='graph-placeholder', component_property='figure'),
#     Input(component_id='my-dmc-radio-item', component_property='value')
# )
# def update_graph(col_chosen):
#     fig = px.histogram(df, x='continent', y=col_chosen, histfunc='avg')
#     return fig

# Run the App
if __name__ == '__main__':
    app.run_server(debug=True)