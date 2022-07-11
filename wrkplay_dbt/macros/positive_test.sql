{% test positive_test(model, column_name) %}

with validation as (

    select
        {{ column_name }} as positive

    from {{ model }}

),

validation_errors as (

    select
        positive 

    from validation
    -- if this is true, then positive is actually negative!
    where positive < 0

)

select *
from validation_errors

{% endtest %}
