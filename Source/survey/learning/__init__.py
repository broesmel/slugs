from random import choices
import string
from tempfile import template
from otree.api import *
from survey import Intro

doc = """
learning
"""


class C(BaseConstants):
    NAME_IN_URL = 'learning'
    PLAYERS_PER_GROUP = None
    NUM_ROUNDS = 1


class Subsession(BaseSubsession):
    pass

class Group(BaseGroup):
    pass


    
def generate_label_div(choices): 
    r = '<div style="display: flex">'
    for x in choices:
        r+=f'''<div style="flex: 1; text-align: center">
                {x}
                <br>
                {generate_img_tag(x)}
            </div>'''
    return r+ '</div>'
def generate_img_tag(filename):
    return f"<img src='/static/{filename}.png'>"
class Player(BasePlayer):
    # section 1
    fruit_not_fit = models.StringField(widget=widgets.RadioSelectHorizontal, choices=['B', 'C', 'D', 'E', 'H'], blank=True, label='Please select the fruit that does not fit into the below Set.' + generate_label_div(['B', 'C', 'D', 'E', 'H']))
    fruit_combine = models.LongStringField(blank=True, label='Please combine the following fruit into sets, by writing the corresponding letters of a combination a line. Always include all the fruits involved in a combination. Add a one word description next to the set that explains why the fruit belong together.<br>' + generate_label_div(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']) + f"Incomplete example: B, C; red")
    fruit_instruction_change = models.StringField(blank=True, 
        label=f'''The selection below was created using this instruction: “Select the green fruit.”<br>
            {generate_label_div(['A', 'D', 'E', 'G'])}<br>
            How should the instruction be changed in order to generate the selection below?<br>
            {generate_label_div(['A', 'E', 'F', 'G'])}''')
    leaf_combine = models.LongStringField(blank=True, label='Please combine the following leaves into sets, by writing the corresponding letters of a combination a line. Always include all the leaves involved in a combination. Add a one word description next to the set that explains why the leaves belong together.<br>' + generate_label_div(['I', 'J', 'K', 'L', 'M', 'N', 'O', 'P']))
    leaf_correct_instructions_1 = models.StringField(blank=True, label=f'Please select the correct instructions to help someone produce the selection  {generate_label_div(["I", "J"])} from the leaves: {generate_label_div(list(string.ascii_uppercase)[8:16])}', choices=['1. Select all leaves that are spiky.', '2. Select all leaves that are round and smooth.', '3. Select all leaves that have 7 segments.', '4. Select all leaves that are darker.',])
    leaf_correct_instructions_2 = models.StringField(blank=True, label=f'Please select the correct instructions to help someone produce the selection {generate_label_div(["O", "N", "L", "K"])} from the leaves: {generate_label_div(list(string.ascii_uppercase)[8:16])}', choices=['1. Select all leaves that are spiky.', '2. Select all leaves that are round and smooth.', '3. Select all leaves that have 7 segments.', '4. Select all leaves that are lighter.',])
    leaf_instruction_change = models.StringField(blank=True, 
        label=f'''The selection below was created using this instruction: “Select all leaves with 7 segments.”<br>
            {generate_label_div(['M', 'P'])}<br>
            How should the instruction be changed in order to generate the selection below?<br>
            {generate_label_div(['K', 'L', 'M', 'N', 'O', 'P'])}''')
    # section 2
    shampoo = models.StringField(blank=True, 
        label='''Zorg, an alien from a planet where everything is understood literally, is visiting earth. Zorg
            bought a shampoo at the supermarket so she can wash her antennae. As she tries it in the
            shower, she can’t seem to finish showering at all because she follows the instructions on the
            bottle exactly. The instructions read:<br>
            <code>
            Wash<br>
            Rinse<br>
            Repeat<br>
            </code>
            <img src="/static/shampoo.png">
            <p>Add or remove a single instruction so she can successfully shower:</p>
            ''')
    watering = models.StringField(blank=True, 
        label='''A homeowner wants to ensure that the newly planted trees in front of her house can grow,
            so she instructs the gardener-robot that she built to always water the plants. After the first
            week, the trees have grown. The second week is rainy, and the trees are flooded with water
            and cannot grow anymore.<br>
            <img src="/static/watering.png"/>
            <p>What mistake did the homeowner make?</p>
            ''')
    thefarm = models.StringField(blank=True, 
        label='''<p>Two people on a farm have the following goal:<br>
            They want to gather 60 apples from the apple trees and bring them into a barrel.<br>
            Each tree holds 10 apples. Currently, both farmers walk up to the tree, grab an apple, put it
            in their bag, return to the house, and put the apple in the barrel.</p>
            
            <img src="/static/thefarm.png">
            <p>Suggest a way of making this process easier for the people on the farm.</p>
            ''')
    # section 3
    js_ifelse = models.IntegerField(blank=True, 
        label='''In the following JavaScript snippet, there is a line missing. Select the answers to fill in the
            missing line that would make it correct and let it log the following output to the console: <code>you
            need to practice debugging</code>.<br>
            JavaScript Snippet: <br>
            <code>
                let goal = 'computational thinking'
                let activity = 'unsure'
                if(goal == 'fastest 100m sprint')
                {
                    activity = 'running'
                }
                // MISSING LINE
                {
                    activity = 'debugging'
                }
                console.log('you need to practice ' + activity)
            </code>'''
        , choices=["if(goal == 'computational thinking')", "else if(goal == 'fastest 100m sprint')", "else", "if goal is computational thinking then"])
    js_while = models.IntegerField(blank=True, 
        label='''In the following JavaScript snippet, there is a line missing. Select the answers to fill in the
            missing line that would make it correct and let it log the following output to the console: <code>you
            need to practice debugging</code>.<br>
            JavaScript Snippet: <br>
            <code>
                let goal = 'computational thinking'
                let activity = 'unsure'
                if(goal == 'fastest 100m sprint')
                {
                    activity = 'running'
                }
                // MISSING LINE
                {
                    activity = 'debugging'
                }
                console.log('you need to practice ' + activity)
            </code>'''
        , choices=["if(goal == 'computational thinking')", "else if(goal == 'fastest 100m sprint')", "else", "if goal is computational thinking then"])
    js_fizzbuzz = models.LongStringField(blank=True, 
        label='''
            Please write a JavaScript function that, for a given input number n, returns the sum of all
            whole numbers divisible by 3 multiplied with the sum of all numbers not divisible by 3, which
            are smaller than n. As a reminder, to test if a number is divisible by another, you can use the
            <code>%</code> operator to get the remainder of a division, for example: <code>4 % 3 = 1</code>, <code>4 % 4 = 0</code>. If the result
            is zero, then the first number is divisible by the second one.<br>
            Here is an outline for a function containing the structure of a <code>while</code> loop.<br>
            <code> <br>
            function bigSum(n) { <br>
            &nbsp&nbsp&nbsp&nbsp while() <br>
            } <br>
            </code> <br>''')\


class PageInherit(Page):
    form_model = 'player'

# PAGES
class Section1(PageInherit):
    template_name='learning/Section.html'
    form_fields = ['fruit_not_fit', 'fruit_combine', 'fruit_instruction_change', 'leaf_combine', 'leaf_correct_instructions_1', 'leaf_correct_instructions_2', 'leaf_instruction_change',]
    def vars_for_template(player):
        return {'section_number': 1}

class Section2(Section1):
    form_fields = ['shampoo', 'watering', 'thefarm']
    def vars_for_template(player):
        return {'section_number': 2}

class Section3(Section1):
    form_fields = ['js_ifelse', 'js_while', 'js_fizzbuzz']
    def is_displayed(player):
        return player.subsession.session.config.get('include_js_test') == True
    def vars_for_template(player):
        return {'section_number': 3}

page_sequence = [Intro, Section1, Section2, Section3]