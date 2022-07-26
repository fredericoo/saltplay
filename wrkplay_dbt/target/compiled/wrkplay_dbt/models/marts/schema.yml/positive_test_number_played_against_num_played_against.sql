

with validation as (

    select
        num_played_against as positive

    from "postgres"."public"."number_played_against"

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

