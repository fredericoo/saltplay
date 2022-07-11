{% test not_empty_table_test(model, column_name) %}

with validation as (

    select
        {{ column_name }} as not_empty_table

    from {{ model }}

),

validation_errors as (

    select
        not_empty_table 

    from validation
    -- if this is true, then table is empty!
    where count(not_empty_table) = 0

)

select *
from validation_errors

{% endtest %}
